const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

app.get("/", (req, res) =>{
    res.send("Assignment Setup Complete!");
})

app.post("/identify", (req, res) =>{
    const { email, phoneNumber} = req.body;
    var primaryContactIds = []; // this is what we are going to fetch from mysql db
    var secondaryContactIds = []; // this as well
    var emails = []; // same as above
    var phoneNumbers = []; // same as above
    res.status(200).json({
        contact: {
            "primaryContatctId": primaryContactIds,
			"emails": emails, // first element being email of primary contact 
			"phoneNumbers": phoneNumbers, // first element being phoneNumber of primary contact
			"secondaryContactIds": secondaryContactIds // Array of all Contact IDs that are "secondary" to the primary contact
        }
    })
})

app.listen(port, ()=>{
    console.log(`Server setup and ready on port ${port}`);
})