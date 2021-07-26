const express = require('express');

const UserController = require('./controllers/UserController');

const app = express();

app.use(express.json());

app.get('/users/:userId', UserController.findById);
app.get('/users', UserController.list);
app.post('/users', UserController.create);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Oops... something bad happened. Please, try again or contact the system admin.';
  return res.status(err.status).json({ error: err.message });
});

module.exports = app;
