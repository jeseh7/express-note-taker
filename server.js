const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const {v4:uuidv4} = require('uuid');
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils.js');
const PORT = 3001;

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json', 'utf8').then(data => res.json(JSON.parse(data)));
})

app.post('/api/notes', (req, res) => {
  const note = req.body;
  console.log(note);
  readAndAppend({id:uuidv4(), ...note}, './db/db.json');
  res.json(db);
})

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  readFromFile('./db/db.json', 'utf8')
  .then(data => {
    const updatedNotes = JSON.parse(data).filter(note => {
      return note.id !== id
    })
    writeToFile('./db/db.json', updatedNotes);
    res.json(updatedNotes);
  })
})

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});