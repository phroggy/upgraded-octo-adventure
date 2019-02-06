var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"

const DB_NAME = "octo";
const COLLECTION_NAME = "events";

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate()+1);

// Seed with some fake events for now for testing
var db_seed = [
  { _id: 1, name: 'Fake Event 1 2019-01-01', location: "Hollywood Bowl", event_date: new Date("2019-01-01"), created_at: new Date(), modified_at: new Date()},
  { _id: 2, name: 'Fake Event 2 (Tomorrow)', location: "Hollywood Bowl", event_date: tomorrow, created_at: new Date(), modified_at: new Date()}
];

MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  var dbo = client.db(DB_NAME);
  var collection = dbo.collection(COLLECTION_NAME);
  collection.drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
    client.close();
  });
  collection.insertMany(db_seed, function(err, res) {
    if (err) throw err;
    console.log("Seeding DB with " + res.insertedCount + " objects");
    client.close();
  });
});

/* GET events listing. */
router.get('/', function(req, res, next) {
  MongoClient.connect(url, function(err, cilent) {
    var dbo = cilent.db(DB_NAME);
    var collection = dbo.collection(COLLECTION_NAME);
    collection.find({}).toArray(function(err, docs) {
        res.json(docs);
    });
    cilent.close();
  });
});

router.get('/today', function(req, res, next) {
  console.log("Today's events");
  // returnDate(new Date(), req, res);
  var today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  getEvents(today, req, res);
});

router.get('/tomorrow', function(req, res, next) {
  console.log("Tomorrow's events");
  // returnDate(tomorrow, req, res);
  getEvents(tomorrow, req, res);
});

router.get('/:date', function(req, res, next) {
  var date = req.params.date;
  console.log("Events for: " + date);
  // returnDate(date, req, res);
  getEvents(new Date(date), req, res);
});

function returnDate(value, req, res) {
  console.log("Parsing Date for value: " + value);
  var date = new Date(value);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  res.send(date);
};

function getEvents(date, req, res) {
  console.log("Looking for events on " + date);
  var events;
  nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate()+1);
  MongoClient.connect(url, function(err, cilent) {
    var dbo = cilent.db(DB_NAME);
    var collection = dbo.collection(COLLECTION_NAME);
    console.log("Looking for events between " + date + " and " + nextDate);
    var query = { $and: [ {event_date: { $gte: date }}, {event_date: { $lt: nextDate }} ]};
    collection.find(query).toArray(function(err, docs) {
        if (err) throw err;
        console.log(docs);
        events = docs;
        res.json(events);
        cilent.close();
    });
  });
};

module.exports = router;
