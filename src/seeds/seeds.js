require('dotenv').config();
const mysql = require('mysql');

function runSeed() {
  // DATABASE CONNECTION CONFIGURATION
  const connection = mysql.createConnection({
    host: `${process.env.host}`,
    user: `${process.env.user}`,
    password: `${process.env.password}`,
    database: `${process.env.database}`
  });

  connection.connect();

  const INSERT_TODO_QUERY = `INSERT INTO todos (task)
  VALUES ('Containerize the Application'), ('Build the Docker Image'), ('Deploy to Kubernetes');`;

  connection.query(INSERT_TODO_QUERY, function(error, results, fields) {
    if (error) {
      console.error(error.message);
      connection.end();
      return;
    }

    console.log('Successfully seeded the database');
    connection.end();
  });
}

runSeed();
