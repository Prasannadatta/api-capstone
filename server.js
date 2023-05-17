const express = require("express");
var bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const usersCollection = require("./mongoDB/index");
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const jwt = require("jsonwebtoken");

app.get("/", cors(),  async(req, res) => {

});

app.post("/", async(req, res) => {
  const {email, password} = req.body ;
    const user = await usersCollection.findOne({email: email})
    if(user){
      if(await bcrypt.compare(password, user.password)) {
        const token = await jwt.sign({_id:user._id, email}, `${process.env.jwtsecret}`, { expiresIn: "2h"});
        user.token = token;
        user.password = undefined;
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true
        };

        res.status(201)
        // .json({ message: "Passwords matched", token: token})
        .cookie("token", token, options)
        .json({
           message: "Passwords matched", token: token
        });
      } else {
        res.send({ message: "Password didn't match"})
      }
    } else {
      res.send({message: "User not registered"})
    }
})

app.post("/signup", async(req, res) => {
  const {name, email, phoneNumber, password} = req.body ;

  try {
    const check = await usersCollection.findOne({email: email})
    console.log(check);
    if(check) {
      res.json("exist");
      console.log('exist');
    }
    else {
      const myEncPassword = await bcrypt.hash(password, 10);
      const userData = {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        password: myEncPassword,
      }
      const user = await usersCollection.create([userData]);
      const token = await jwt.sign({_id:user._id, email}, `${process.env.jwtsecret}`, { expiresIn: "2h"});
      user.token = token;
      user.password = undefined;
      res.status(201).json(user);
        // console.log(token,'token');
        // const userVerify = await jwt.verify({ token, ""});
    }
  }
  catch(e) {
    res.json("notExist");
  }
})

app.listen(4000, function() {
  console.log("Server started on port 4000");
});
