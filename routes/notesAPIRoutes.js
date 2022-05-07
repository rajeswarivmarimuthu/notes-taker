// Importing the required packages 
const express = require('express');
const notes = require('express').Router();
const path = require('path');
const fs = require('fs');
const uuid = require('../helper/uuid');

//Setting up the express middleware
notes.use(express.json());
notes.use(express.urlencoded({ extended: true }));

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  fs.readFile("./db/db.json", 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      res.json(JSON.parse(data));
    }
  });
  });

  //POST route for save the notes 
  notes.post('/',(req,res) => {

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  //If both title and text are present, then process the data and upload to DB
  if (title && text) {
    // Variable for the object we will save
    const newNotes = {
      title,
      text,
      id:uuid()
    };

    //Get the data from the database file
    fs.readFile("./db/db.json", 'utf8', (err, data) => {
      if (err) {
        console.error('are we erroring out' + err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNotes);
      
      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated reviews!')
      )};
      const response = {
        status: 'success',
        body: newNotes,
      };
      console.log(response);
      res.status(201).json(response);
    });
  }
  else {
    res.status(400).json('Error in posting review');
  }
  });

  // DELETE route to delete the notes by id
  notes.delete("/:id",(req,res) => {
    console.log('In deleteroute')
    let notesID = req.params.id;
    if (req.body && req.params.id) {
      fs.readFile("./db/db.json", 'utf8', (err, data) => {
        if (err) {
          console.error('are we erroring out' + err);
        } else {
          // Convert string into JSON object
          const parsedNotes4Del = JSON.parse(data);
          let notesFound = parsedNotes4Del.findIndex(e => e.id == notesID);
          console.log ('In delete' + notesFound);
          if (notesFound >=0) {
            parsedNotes4Del.splice(notesFound,1);
            fs.writeFile(
              './db/db.json',
              JSON.stringify(parsedNotes4Del, null, 4),
              (writeErr) =>
                writeErr
                  ? console.error(writeErr)
                  : console.info('Successfully deleted notes!')
            )
            res.json(parsedNotes4Del);
          }
        }
      });
    } else {
      console.log('error in req');
      res.json('invalid request');
    };
  });
  


module.exports = notes; 

