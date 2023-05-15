const express = require("express");
const usersCollection = require("./mongoDB/index");
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.get("/", cors(),  async(req, res) => {

});

app.post("/", async(req, res) => {
  const {email, password} = req.body ;
    const user = await usersCollection.findOne({email: email})
    if(user){
      if(password === user.password ) {
        res.send({message: "Login Successfull", user: user})
      } else {
        res.send({ message: "Password didn't match"})
      }
    } else {
      res.send({message: "User not registered"})
    }
})

app.post("/signup", async(req, res) => {
  const {name, email, phoneNumber, password} = req.body ;
  const userData = {
    name: name,
    email: email,
    phoneNumber: phoneNumber,
    password: password,
  }
  try {
    const check = await usersCollection.findOne({email: email})
    console.log(check);
    if(check) {
      res.json("exist");
      console.log('exist');
    }
    else {
      res.json("notExist");
      console.log('not exist');
      await usersCollection.create([userData]);
    }
  }
  catch(e) {
    res.json("notExist");
  }
})

app.listen(4000, function() {
  console.log("Server started on port 4000");
});
