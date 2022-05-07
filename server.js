// Import necessary packages for notes taker
const express = require('express');
const path = require('path');
const api = require('./routes/index.js');

//Setting up PORTand the express application
const PORT = process.env.PORT || 3001;
const app = express();

//Setting up the express middleware applications
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', api);
app.use(express.static('public'));

//HTML get Routes
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);