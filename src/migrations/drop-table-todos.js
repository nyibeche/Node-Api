require('dotenv').config();
const mysql = require('mysql');

function runMigration() {
  // DATABASE CONNECTION CONFIGURATION
  const connection = mysql.createConnection({
    host: `${process.env.host}`,
    user: `${process.env.user}`,
    password: `${process.env.password}`,
    database: `${process.env.database}`
  });

  connection.connect();

  const CREATE_TABLE_TODO_QUERY = `DROP TABLE todos;`;

  connection.query(CREATE_TABLE_TODO_QUERY, function(error, results, fields) {
    if (error) {
      console.error(error.message);
      connection.end();
      return;
    }

    console.log('Successfully ran migration: DROP TABLE TODOS');
    connection.end();
  });
}

runMigration();
