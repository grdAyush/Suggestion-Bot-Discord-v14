const { white, green } = require("chalk");

module.exports = (client) => {
  require("./Manager/interactionCreate.js")(client);
  console.log(
    white("[") +
      green("INFO") +
      white("] ") +
      green("System ") +
      white("Manager Files") +
      green(" Loaded!")
  );
};
