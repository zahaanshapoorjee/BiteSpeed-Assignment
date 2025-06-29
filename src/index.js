const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

app.get("/", (req, res) =>{
    res.send("Assignment Setup Complete!");
})

app.post("/identify", (req, res) =>{
    const { email, phoneNumber} = req.body;
    res.status(200).json({
        message: "Data received by identify endpoint",
        data: {
            email: email? email: "No email provided",
            phoneNumber: phoneNumber? phoneNumber: "No phone number provided"
        }
    })
})

app.listen(port, ()=>{
    console.log(`Server setup and ready on port ${port}`);
})