const { response } = require('express')
const { Pool } = require('pg')

// const pool = new Pool({
//     user: "postgres",
//     password: "postgrespassword",
//     host: "localhost",
//     port: 5432,
//     database: "zoning"
// })

const pool = new Pool({
    user: "doadmin",
    password: "AVNS_Y7EyaRi9KS1YPtdGhQR",
    host: "db-postgresql-nyc3-74989-do-user-2929740-0.c.db.ondigitalocean.com",
    port: 25060,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: false, // Use this option to ignore self-signed certificate errors
      },
})

// username = doadmin
// password = AVNS_Y7EyaRi9KS1YPtdGhQR
// host = db-postgresql-nyc3-74989-do-user-2929740-0.c.db.ondigitalocean.com
// port = 25060
// database = defaultdb
// sslmode = require

// pool.query("CREATE DATABASE zoning;").then((Response) => {
//     console.log("Database Created")
//     console.log(response)
// })
// .catch((err) => {
//     console.log(err);
// });

module.exports = pool;