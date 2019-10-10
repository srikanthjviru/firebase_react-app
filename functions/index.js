// firebase setup
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

//Setting the express server
const express = require("express");
const app = express();

app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .get()
    .then(data => {
      let scream = [];
      data.forEach(doc => {
        scream.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      console.log("Screaming....", scream);
      return res.json(scream);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };
  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "Something wrong.. :(" });
    });
});

exports.api = functions.https.onRequest(app);
