const express = require('express');
const router = express.Router();
const connection = require('../database/db');

// Main Assignment Code: POST /identify endpoint for identity reconciliation
router.post("/identify", (req, res) => {
    const { email, phoneNumber } = req.body;

    // Instructiosn say both are optional, but we NEED at least 1 of each to proceed..
    if (!email && !phoneNumber) {
        return res.status(400).json({ error: "At least one of email or phoneNumber is required." });
    }

    // First well query for matching email or phone number
    const query = `
        SELECT * FROM Contact 
        WHERE (email = ? AND email IS NOT NULL) OR (phoneNumber = ? AND phoneNumber IS NOT NULL)
    `;
    connection.query(query, [email, phoneNumber], (err, relatedContacts) => {

        if (err) { 
            return res.status(500).json({ error: "Error connecting to database: ", details: err });
        }

        const currTime = new Date();

        if (relatedContacts.length === 0) {
            // If we have no related contacts found, so that means we must create a new primary contact
            connection.query(
                `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt)
                VALUES (?, ?, NULL, 'primary', ?, ?)`,
                [email, phoneNumber, currTime, currTime],
                (err, insertResult) => {
                    if (err) {
                        // Handle error while inserting new record
                        return res.status(500).json({
                            error: "Error inserting new record into database",
                            details: err
                        });
                    }
                    // Respond with the new primary contact info
                    return res.status(200).json({
                        contact: {
                            primaryContatctId: insertResult.insertId,
                            emails: email ? [email] : [],
                            phoneNumbers: phoneNumber ? [phoneNumber] : [],
                            secondaryContactIds: []
                        }
                    });
                }
            );
        } else {
            // At least one related contact found (primary or secondary)
            // Find all unique primary contacts among the related contacts
            const primaryContacts = relatedContacts.filter(c => c.linkPrecedence === 'primary');
            let primary;
            if (primaryContacts.length > 1) {
                // Merge needed: more than one primary found, merge them
                primary = primaryContacts.reduce((oldest, curr) =>
                    new Date(curr.createdAt) < new Date(oldest.createdAt) ? curr : oldest
                );
                const toBeSecondary = primaryContacts.filter(c => c.id !== primary.id);
                const toBeSecondaryIds = toBeSecondary.map(c => c.id);

                if (toBeSecondaryIds.length > 0) {
                    // Update the other primaries and their secondaries to point to the oldest primary
                    connection.query(
                        `UPDATE Contact SET linkPrecedence = 'secondary', linkedId = ? WHERE id IN (?) OR linkedId IN (?)`,
                        [primary.id, toBeSecondaryIds, toBeSecondaryIds],
                        (err) => {
                            if (err) {
                                return res.status(500).json({ error: "Error merging primaries", details: err });
                            }
                            // After merging, fetch all contacts linked to the new primary
                            fetchAndRespond(primary.id);
                        }
                    );
                    return;
                }
            } else {
                // if theres only one we fallback to it
                primary = primaryContacts[0] || relatedContacts[0];
            }

            // Now lets fetch all contacts linked with the found primary contact and respond
            fetchAndRespond(primary.id);

            function fetchAndRespond(primaryId) {
                connection.query(
                    `SELECT * FROM Contact WHERE id = ? OR linkedId = ?`,
                    [primaryId, primaryId],
                    (err, allRelated) => {
                        if (err) {
                            return res.status(500).json({
                                error: "Database error",
                                details: err
                            });
                        }

                        // First we collect unique emails and phoneNumbers, handle nulls/duplicates (edge cases, not really mentioned in the instructions but am implementing in case)
                        const emailsSet = new Set(allRelated.map(c => c.email).filter(Boolean));
                        const phoneNumbersSet = new Set(allRelated.map(c => c.phoneNumber).filter(Boolean));
                        let isNewEmail = email && !emailsSet.has(email);
                        let isNewPhone = phoneNumber && !phoneNumbersSet.has(phoneNumber);

                        // We also prevent duplicate secondary contacts for the same info
                        if ((isNewEmail || isNewPhone) && (email || phoneNumber)) {
                            connection.query(
                                `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt)
                                VALUES (?, ?, ?, 'secondary', ?, ?)`,
                                [email, phoneNumber, primaryId, currTime, currTime],
                                (err, insertResult) => {
                                    if (err) {
                                        return res.status(500).json({
                                            error: "Error inserting new secondary contact",
                                            details: err
                                        });
                                    }
                                    // Finally after we update lets fetch all contacts again to return the updated consolidated info
                                    connection.query(
                                        `SELECT * FROM Contact WHERE id = ? OR linkedId = ?`,
                                        [primaryId, primaryId],
                                        (err, updatedContacts) => {
                                            if (err) {
                                                return res.status(500).json({
                                                    error: "Database error after insert",
                                                    details: err
                                                });
                                            }
                                            respondWithConsolidated(primaryId, updatedContacts);
                                        }
                                    );
                                }
                            );
                        } else {
                            respondWithConsolidated(primaryId, allRelated);
                        }
                    }
                );
            }

            function respondWithConsolidated(primaryId, contactsArr) {
                // Sort so primary's email/phone is first
                const primaryContact = contactsArr.find(c => c.id === primaryId);
                const emails = [
                    ...(primaryContact.email ? [primaryContact.email] : []),
                    ...[...new Set(contactsArr.map(c => c.email).filter(e => e && e !== primaryContact.email))]
                ];
                const phoneNumbers = [
                    ...(primaryContact.phoneNumber ? [primaryContact.phoneNumber] : []),
                    ...[...new Set(contactsArr.map(c => c.phoneNumber).filter(p => p && p !== primaryContact.phoneNumber))]
                ];
                const secondaryContactIds = contactsArr
                    .filter(c => c.linkPrecedence === 'secondary')
                    .map(c => c.id);

                // Response as per the instructions given by you (Again, whoever is reviewing the code at BiteSpeed :D)
                return res.status(200).json({
                    contact: {
                        primaryContatctId: primaryId,
                        emails,
                        phoneNumbers,
                        secondaryContactIds
                    }
                });
            }
        }
    });
});

module.exports = router;