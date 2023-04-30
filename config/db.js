const mongoose = require("mongoose");

const MONGOURI = "mongodb+srv://taskariodb:TpfcZYIQIbUbr0eX@cluster0.ejiyest.mongodb.net/test";

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true
    });
    console.log("Connected to DB");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;