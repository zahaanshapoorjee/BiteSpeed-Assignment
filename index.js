const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) =>{
    res.send("Assignment Setup Complete!");
})

app.listen(port, ()=>{
    console.log(`Server setup and ready on port ${port}`);
})