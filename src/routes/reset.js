const express = require('express');
const router = express.Router();
const connection = require('../database/db');

// I have made this endpoint for ease of the person reviewing the code, you can just open the link I provided/reset in the browser to reset the MySQL DB back to original state
// Where it has one entry, that is, the one you provided to me in the instructions

router.get("/reset", (req, res) => {
    const now = new Date();
    // Delete all rows from Contact table
    connection.query('DELETE FROM Contact', (err) => {
        if (err) {
            console.error('Error deleting rows:', err);
            return res.status(500).json({ error: 'Error deleting rows', details: err });
        }
        // Reset the auto-increment counter so new IDs start from 2
        connection.query('ALTER TABLE Contact AUTO_INCREMENT = 2', (err) => {
            if (err) {
                console.error('Error resetting AUTO_INCREMENT:', err);
                return res.status(500).json({ error: 'Error resetting AUTO_INCREMENT', details: err });
            }
            // Insert the default row as per assignment instructions
            const insertQuery = `
                INSERT INTO Contact (id, phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt, deletedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            connection.query(
                insertQuery,
                [
                    1,
                    "123456",
                    "lorraine@hillvalley.edu",
                    null,
                    "primary",
                    now,
                    now,
                    null
                ],
                (err, result) => {
                    if (err) {
                        console.error('Error inserting row:', err);
                        return res.status(500).json({ error: 'Error inserting row', details: err });
                    } else {
                        console.log('Row inserted successfully.');
                        return res.status(200).json({ message: 'Database reset to default state.' });
                    }
                }
            );
        });
    });
});

module.exports = router;