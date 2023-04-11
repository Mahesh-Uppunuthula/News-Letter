require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { request, response } = require("express");
const https = require("https");
const { log } = require("console");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/signUp.html");

});

app.post("/", (request, response) => {
    const Fname = request.body.fname;
    const Lname = request.body.lname;
    const Email = request.body.email;

    console.log(Fname, Lname, Email);


    const userData =
    {
        members: [
            {
                email_address: Email,
                status: "subscribed",
                merge_fields:
                {
                    FNAME: Fname,
                    LNAME: Lname
                }
            }
        ]
    }


    const jsonStrUserData = JSON.stringify(userData);

    const url = "https://us21.api.mailchimp.com/3.0/lists/d8a7d0fd70";
    const options =
    {
        method: "POST",
        auth:process.env.AUTH_KEY
    }
    const req = https.request(url, options, (res) => {
        
        if(res.statusCode === 200) 
        {
            response.sendFile(__dirname +"/success.html");
        }
        else response.sendFile(__dirname + "/failure.html");
        
        res.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    });

    req.write(jsonStrUserData);
    req.end();

    
})

app.post("/failure", (request, response) =>{
    response.redirect("/");
})

app.listen(process.env || 3000, (res) => {
    console.log("Server up and running on 3000 port");
})
