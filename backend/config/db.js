const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "mootezaa1234",
  database: "hotel",
  port: 5432,
});

client
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));
 

module.exports = client;