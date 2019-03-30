var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI || "mongodb://mongo:27017/octo"

const COLLECTION_NAME = "events";

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate()+1);

// Seed with some fake events for now for testing
var new_years = new Date("2019-01-01");
new_years.setMinutes(new_years.getMinutes()+new_years.getTimezoneOffset());
var db_seed = [
  { _id: 1, name: 'Fake Event 1 2019-01-01', location: "Hollywood Bowl", event_date: new_years, created_at: new Date(), modified_at: new Date()},
  { _id: 2, name: 'Fake Event 2 (Tomorrow)', location: "Hollywood Bowl", event_date: tomorrow, created_at: new Date(), modified_at: new Date()}
];

// TODO: replace all console.logs with real logger
// https://github.com/phroggy/upgraded-octo-adventure/issues/9
console.log("Connecting to MongoDB at: " + url);
MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  var dbo = client.db();
  var collection = dbo.collection(COLLECTION_NAME);
  collection.deleteMany({}, function(err, res) {
    if (err) throw err;
    if (res) console.log("Docs deleted: " + res.deletedCount);
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
    var dbo = cilent.db();
    var collection = dbo.collection(COLLECTION_NAME);
    collection.find({}).toArray(function(err, docs) {
        res.json(docs);
    });
    cilent.close();
  });
});

router.get('/today', function(req, res, next) {
  console.log("Today's events");
  var today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  getEvents(today, req, res);
});

router.get('/tomorrow', function(req, res, next) {
  console.log("Tomorrow's events");
  getEvents(tomorrow, req, res);
});

router.get('/:date', function(req, res, next) {
  var date = req.params.date;
  console.log("Events for: " + date);
  var local_date = new Date(date);
  console.log("Parsed date: " + local_date);
  local_date.setMinutes(local_date.getMinutes() + local_date.getTimezoneOffset());
  console.log("Local date: " + local_date);
  getEvents(local_date, req, res);
});

/* get events from the DB for the date given and return in response */
function getEvents(date, req, res) {
  console.log("Looking for events on " + date);
  var events;
  nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate()+1);
  MongoClient.connect(url, function(err, cilent) {
    var dbo = cilent.db();
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
