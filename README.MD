# BiteSpeed Identity Reconciliation Assignment

This is a backend service for the BiteSpeed assignment, built with Node.js, Express, and MySQL (hosted on GCP).

## Hosted Link

**Base URL:**  
[https://bitespeed-assignment-zahaan-shapoorjee.onrender.com/](https://bitespeed-assignment-zahaan-shapoorjee.onrender.com/)

---

## Endpoints

### 1. `/identify` (POST)

**Purpose:**  
Identify and consolidate user contacts as per the assignment instructions.

**Request Body (JSON):**
```json
{
  "email": "user@example.com",    // optional
  "phoneNumber": "1234567890"     // optional
}
```
At least one of `email` or `phoneNumber` is required.

**Example cURL:**
```bash
curl -X POST https://bitespeed-assignment-zahaan-shapoorjee.onrender.com/identify \
  -H "Content-Type: application/json" \
  -d '{"email":"lorraine@hillvalley.edu","phoneNumber":"123456"}'
```

**Response:**
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

---

### 2. `/reset` (GET)

**Purpose:**  
Resets the MySQL database to its original state with a single default contact.

**How to use:**  
Just visit [https://bitespeed-assignment-zahaan-shapoorjee.onrender.com/reset](https://bitespeed-assignment-zahaan-shapoorjee.onrender.com/reset) in your browser or use cURL:

```bash
curl https://bitespeed-assignment-zahaan-shapoorjee.onrender.com/reset
```

---

## Database

- MySQL database hosted on Google Cloud Platform (GCP).
- The `Contact` table is managed as per the assignment requirements.

---

## Testing

You can test the endpoints using **Postman** (recommended) or **cURL**.

---

### Using Postman

1. **Reset the Database**
   - Method: `GET`
   - URL: `https://bitespeed-assignment-zahaan-shapoorjee.onrender.com/reset`
   - Click **Send**. You should get a confirmation message.

2. **Test the `/identify` Endpoint**
   - Method: `POST`
   - URL: `https://bitespeed-assignment-zahaan-shapoorjee.onrender.com/identify`
   - Go to the **Body** tab, select **raw** and choose **JSON**.
   - Example body:
     ```json
     {
       "email": "lorraine@hillvalley.edu",
       "phoneNumber": "123456"
     }
     ```
   - Click **Send**. You should see the consolidated contact response.

3. **Try Different Scenarios**
   - Change the email and/or phoneNumber to test new and existing contacts.
   - Example:
     ```json
     {
       "email": "mcfly@hillvalley.edu",
       "phoneNumber": "123456"
     }
     ```
   - Observe how the response changes as per the assignment logic.

---

### Using cURL

**Reset the database:**
```bash
curl https://bitespeed-assignment-zahaan-shapoorjee.onrender.com/reset
```

**Test `/identify`:**
```bash
curl -X POST https://bitespeed-assignment-zahaan-shapoorjee.onrender.com/identify \
  -H "Content-Type: application/json" \
  -d '{"email":"lorraine@hillvalley.edu","phoneNumber":"123456"}'
```

---

**Tip:**  
You can repeat the above steps with different emails and phone numbers to see how the service links and consolidates contacts.

---

## Notes

- All endpoints accept and return JSON.
---