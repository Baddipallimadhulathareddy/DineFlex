require("dotenv").config();

const brevo = require("@getbrevo/brevo");

console.log("BREVO EXPORTS:");
console.log(Object.keys(brevo));

module.exports = async () => {
  return true;
};