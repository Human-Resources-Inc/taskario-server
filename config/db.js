const mongoose = require("mongoose");

const MONGOURI = "mongodb+srv://taskariodb:TpfcZYIQIbUbr0eX@cluster0.ejiyest.mongodb.net/test";

/**
 * Производит подключение к MongoDB датабазе
 * @param {string} MONGOURI - MongoDB URI для подключения к БД
 */
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