const express = require('express');
require('dotenv').config();

// Initializing Express 
const app = express();
const port = process.env.PORT || 3000;

//as per the instructions, I am parsing jsons, limiting 10mb for safety
app.use(express.json({ limit: '10mb' }));

app.get("/", (req, res) => {
    res.send("Assignment Setup Complete!");
});

// Ive made 2 routes, one as per the instructions, the identify route, you have given (I am speaking to whoever at BiteSpeed is reviewing the code), and another to reset the MySQL database
// back to its original form with only one entry, just like in the instructions:
//{
// 	id                   1                   
//   phoneNumber          "123456"
//   email                "lorraine@hillvalley.edu"
//   linkedId             null
//   linkPrecedence       "primary"
//   createdAt            2023-04-01 00:00:00.374+00              
//   updatedAt            2023-04-01 00:00:00.374+00              
//   deletedAt            null
// }

app.use(require('./routes/identify'));
app.use(require('./routes/reset'));

app.listen(port, () => {
    console.log(`Server setup and ready on port ${port}`);
});