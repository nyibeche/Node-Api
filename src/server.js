require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

// APP CONFIGURATION
app.use(
  cors({
    origin: `*`,
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

console.log(
  `Establishing connection to database: ${process.env.user}:${process.env.password}@${process.env.host}/${process.env.database}...`
);

// DATABASE CONNECTION CONFIGURATION
const dbConnect = mysql.createConnection({
  host: `${process.env.host}`,
  user: `${process.env.user}`,
  password: `${process.env.password}`,
  database: `${process.env.database}`,
});

dbConnect.connect();

// RESTFUL ROUTES
app.get('/', (req, res) => {
  res.redirect('/todos');
});

// INDEX ROUTE
app.get('/todos', (req, res) => {
  dbConnect.query('SELECT * FROM todos', (error, results, fields) => {
    if (error) {
      console.log('ERROR!');
      console.log(error);
    } else {
      res.send({ error: false, data: results, message: 'current todos' });
    }
  });
});

// CREATE ROUTE
app.post('/todos', function (req, res) {
  let todo = req.body;
  console.log('TODO POST CALLED');
  console.log(req.body);
  if (!todo) {
    return res
      .status(400)
      .send({ error: true, message: 'Please provide a todo.' });
  }
  dbConnect.query(
    'INSERT INTO todos SET ? ',
    { task: todo.task, completed: false },
    (error, results, fields) => {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: 'Success! A new todo has been created',
      });
    }
  );
});

// UPDATE ROUTE
app.put('/todos', (req, res) => {
  const { id, task, completed } = req.body;
  console.log('PUT CALLED');
  console.log(req.body);
  if (!id || !task) {
    return res.status(400).send({
      error: false,
      data: [],
      message: 'Please provide a todo and todo_id',
    });
  }
  dbConnect.query(
    'UPDATE todos SET task = ?, completed = ? WHERE id = ?',
    [task, completed, id],
    (error, results, fields) => {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: 'Success! todo has been updated.',
      });
    }
  );
});

// DELETE ROUTE
app.delete('/todos/:id', (req, res) => {
  let todo_id = req.params.id;
  if (!todo_id) {
    return res
      .send(400)
      .send({ error: true, message: 'Please provide a todo_id' });
  }
  dbConnect.query(
    'DELETE FROM todos WHERE id = ?',
    [todo_id],
    (error, results, fields) => {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: 'Success! todo has been removed',
      });
    }
  );
});

// Start the server
app.listen(3004, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('SERVER LISTENING ON PORT 3004');
  console.log('YOU CAN ACCESS YOUR API AT: http://localhost:3004');
});

module.exports = app;
