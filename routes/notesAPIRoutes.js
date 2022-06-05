// Importing the required packages 
const express = require('express');
const notes = require('express').Router();
const path = require('path');
const fs = require('fs');
const uuid = require('../helper/uuid');
const request = require('request');
const axios = require('axios');
const { compileFunction } = require('vm');
require('dotenv').config();

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

// notes.post('/createtemplate', async(req,res)=> {
//   console.log('In createtemplate');
//   templateMeta = {
//     "name": "KnickKnack - New Request Notification",
//     "title": "KnickKnack - New Request Notification",
//     "html": "./public/email.html"
//   }
//   try {
//       const resp = await axios.post(
//       process.env.TRUSTIFI_URL + '/api/i/v1/template', 
//       templateMeta,
//       {headers: {
//         'x-trustifi-key': process.env.TRUSTIFI_KEY,
//         'x-trustifi-secret': process.env.TRUSTIFI_SECRET,
//         'Content-Type': 'application/json'
//       }},
//     );
//     res.status(200).json(resp.data);
//   } catch (err)
//   {
//     console.log (err);
//     res.json('invalid request');
//   }

// })

notes.post('/sendemail', async (req,res)=> {
  console.log('In sendemail');
  console.log ('req.body.requestor_notes ', req.body.requestor_notes);
  console.log('req.body.requestor_email ', req.body.requestor_email);
  console.log('req.body.provider_email ', req.body.provider_email);
  console.log('req.body.provider_name ', req.body.provider_name);
  const emailData = {
    "template": {
      "name": "KnickKnack - New Request Notification",
      "fields": {
        "second_field": req.body.requestor_notes,
        "third_field": req.body.requestor_email
      }
    },
    "recipients": [{"email": req.body.provider_email, "name": req.body.provider_name}]
  };

  try {
    const resp = await axios.post(
    process.env.TRUSTIFI_URL + '/api/i/v1/email', 
    emailData,
    {headers: {
      'x-trustifi-key': process.env.TRUSTIFI_KEY,
      'x-trustifi-secret': process.env.TRUSTIFI_SECRET,
      'Content-Type': 'application/json'
    }},
  );
  res.status(200).json(resp.data);
}
catch(err) {
  console.log (err);
  res.json('invalid request');
}
});

module.exports = notes; 

