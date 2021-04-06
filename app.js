const express = require("express");
const bodyParser = require("body-parser");
const mailChimp = require("@mailchimp/mailchimp_marketing");
const request = require("request");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function(){
  console.log("server running port 3000");
});

app.get("/", function(req,res){
  res.sendFile(__dirname + "/index.html");
});

mailChimp.setConfig({
  apiKey:"ae2b52f1d6110348debf10803edd28dc-us1",
  server:"us1"
});

app.post("/", function(req,res){
  const listId = "8b77cf6e95";
  const firstName = req.body.fname;
  const secondName = req.body.lname;
  const email = req.body.email;

  const subscribingUser = {
    firstName: firstName,
    lastName: secondName,
    email:email
  };
  async function run(){
    const response = await mailChimp.lists.addListMember(listId, {
      email_address:subscribingUser.email,
      status:"subscribed",
      merge_fields:{
        FNAME:subscribingUser.firstName,
        LNAME:subscribingUser.lastName
      }
    });
    console.log("succesfully added new record");
    res.sendFile(__dirname + "/success.html");
  }
  run().catch(e => res.sendFile(__dirname + "/failure.html"));
});
