const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/google-docs-clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true,
})
.then(() => {
  console.log("Database connected succesfully");
})
.catch((e) => {
  console.log("Database Connection failed", e);
})

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

const User = mongoose.model("users", userSchema)

module.exports = User;
