var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI || "mongodb://localhost:27017/octo"

const COLLECTION_NAME = "events";

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate()+1);

// Seed with some fake events for now for testing
var new_years = new Date("2019-01-01");
new_years.setMinutes(new_years.getMinutes()+new_years.getTimezoneOffset());
var db_seed = [
  { _id: 1, name: 'Fake Event 1 2019-01-01', location: "Hollywood Bowl", event_date: new_years, created_at: new Date(), modified_at: new Date()},
  { _id: 2, name: 'Fake Event 2 (Tomorrow)', location: "Hollywood Bowl", event_date: tomorrow, created_at: new Date(), modified_at: new Date()},
  { name: 'The 17th Korea Times Music Festival', location: "Hollywood Bowl", event_date: new Date("2019-04-28T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Chris Tomlin - Worship At Hollywood Bowl', location: "Hollywood Bowl", event_date: new Date("2019-05-05T02:30:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Disney The Little Mermaid An Immersive Live-To-Film Concert Experience', location: "Hollywood Bowl", event_date: new Date("2019-05-18T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Disney The Little Mermaid An Immersive Live-To-Film Concert Experience', location: "Hollywood Bowl", event_date: new Date("2019-05-19T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'New Kids On The Block: The Mixtape Tour', location: "Hollywood Bowl", event_date: new Date("2019-05-27T02:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'KIDZ BOP World Tour 2019', location: "Hollywood Bowl", event_date: new Date("2019-06-02T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Dead & Company', location: "Hollywood Bowl", event_date: new Date("2019-06-04T02:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Dead & Company', location: "Hollywood Bowl", event_date: new Date("2019-06-05T02:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Playboy Jazz Festival', location: "Hollywood Bowl", event_date: new Date("2019-06-08T22:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Playboy Jazz Festival', location: "Hollywood Bowl", event_date: new Date("2019-06-09T22:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Opening Night at the Bowl w/ John Legend', location: "Hollywood Bowl", event_date: new Date("2019-06-16T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Chromeo', location: "Hollywood Bowl", event_date: new Date("2019-06-17T02:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Andrea Bocelli In Concert', location: "Hollywood Bowl", event_date: new Date("2019-06-19T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Andrea Bocelli In Concert', location: "Hollywood Bowl", event_date: new Date("2019-06-20T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: '30th Annual MARIACHI USA ®', location: "Hollywood Bowl", event_date: new Date("2019-06-23T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Santana: Supernatural Now', location: "Hollywood Bowl", event_date: new Date("2019-06-25T02:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Hootie & The Blowfish: Group Therapy Tour', location: "Hollywood Bowl", event_date: new Date("2019-06-26T02:30:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Harry Potter and the Order of the Phoenix in Concert', location: "Hollywood Bowl", event_date: new Date("2019-06-30T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'ABBA: The Concert', location: "Hollywood Bowl", event_date: new Date("2019-07-01T02:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Nile Rodgers w/ Chic', location: "Hollywood Bowl", event_date: new Date("2019-07-03T02:30:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Nile Rodgers w/ Chic', location: "Hollywood Bowl", event_date: new Date("2019-07-04T02:30:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Nile Rodgers w/ Chic', location: "Hollywood Bowl", event_date: new Date("2019-07-05T02:30:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Leon Bridges', location: "Hollywood Bowl", event_date: new Date("2019-07-06T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Chrissie Hynde', location: "Hollywood Bowl", event_date: new Date("2019-07-07T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Reggae Night', location: "Hollywood Bowl", event_date: new Date("2019-07-08T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Symphonie fantastique', location: "Hollywood Bowl", event_date: new Date("2019-07-10T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Tony Bennett', location: "Hollywood Bowl", event_date: new Date("2019-07-11T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Falla & Flamenco', location: "Hollywood Bowl", event_date: new Date("2019-07-12T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Cydi Lauper', location: "Hollywood Bowl", event_date: new Date("2019-07-13T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Cydi Lauper', location: "Hollywood Bowl", event_date: new Date("2019-07-14T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'An Intimate Evening with Kristin Chenoweth', location: "Hollywood Bowl", event_date: new Date("2019-07-15T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Dudamel Conducts Dvorak and Prokofiev', location: "Hollywood Bowl", event_date: new Date("2019-07-17T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Dudamel Conducts Rachmaninoff', location: "Hollywood Bowl", event_date: new Date("2019-07-19T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Hugh Jackman', location: "Hollywood Bowl", event_date: new Date("2019-07-20T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Hugh Jackman', location: "Hollywood Bowl", event_date: new Date("2019-07-21T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Natalia Lafourcade and Gustavo Dudamel', location: "Hollywood Bowl", event_date: new Date("2019-07-22T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Dudamel Conducts Mahler\'s 2nd', location: "Hollywood Bowl", event_date: new Date("2019-07-24T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Dudamel & Yuja Wang', location: "Hollywood Bowl", event_date: new Date("2019-07-26T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Into the Woods', location: "Hollywood Bowl", event_date: new Date("2019-07-27T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Into the Woods', location: "Hollywood Bowl", event_date: new Date("2019-07-28T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Into the Woods', location: "Hollywood Bowl", event_date: new Date("2019-07-29T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Ozzy Osbourne', location: "Hollywood Bowl", event_date: new Date("2019-07-30T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Beethoven, Bruch and Brahms', location: "Hollywood Bowl", event_date: new Date("2019-07-31T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Michael McDonald & Chaka Khan', location: "Hollywood Bowl", event_date: new Date("2019-08-01T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Dvorak & Haydn', location: "Hollywood Bowl", event_date: new Date("2019-08-02T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'The Gipsy Kings', location: "Hollywood Bowl", event_date: new Date("2019-08-03T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'The Gipsy Kings', location: "Hollywood Bowl", event_date: new Date("2019-08-04T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Lord Huron', location: "Hollywood Bowl", event_date: new Date("2019-08-05T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Lionel Richie', location: "Hollywood Bowl", event_date: new Date("2019-08-06T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Mozart Masterworks', location: "Hollywood Bowl", event_date: new Date("2019-08-07T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Buddy Guy', location: "Hollywood Bowl", event_date: new Date("2019-08-08T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Vivaldi\'s Four Seasons', location: "Hollywood Bowl", event_date: new Date("2019-08-09T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Tchaikovsky Spectacular', location: "Hollywood Bowl", event_date: new Date("2019-08-10T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Tchaikovsky Spectacular', location: "Hollywood Bowl", event_date: new Date("2019-08-11T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Death Cab for Cutie w/ Car Seat Headrest', location: "Hollywood Bowl", event_date: new Date("2019-08-12T02:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Britain at the Bowl', location: "Hollywood Bowl", event_date: new Date("2019-08-14T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Ivan Lins', location: "Hollywood Bowl", event_date: new Date("2019-08-15T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'America in Space', location: "Hollywood Bowl", event_date: new Date("2019-08-16T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Jurassic Park in Concert', location: "Hollywood Bowl", event_date: new Date("2019-08-17T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Jurassic Park in Concert', location: "Hollywood Bowl", event_date: new Date("2019-08-18T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Dave Koz', location: "Hollywood Bowl", event_date: new Date("2019-08-19T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Peter and the Wolf', location: "Hollywood Bowl", event_date: new Date("2019-08-21T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Herbie Hancock', location: "Hollywood Bowl", event_date: new Date("2019-08-22T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Appalachian Spring', location: "Hollywood Bowl", event_date: new Date("2019-08-23T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Pink Martini', location: "Hollywood Bowl", event_date: new Date("2019-08-24T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Pink Martini', location: "Hollywood Bowl", event_date: new Date("2019-08-25T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Pink Martini', location: "Hollywood Bowl", event_date: new Date("2019-08-26T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Beethoven\'s Ninth', location: "Hollywood Bowl", event_date: new Date("2019-08-28T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'The Roots', location: "Hollywood Bowl", event_date: new Date("2019-08-29T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Beethoven\'s Ninth', location: "Hollywood Bowl", event_date: new Date("2019-08-30T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'John Williams', location: "Hollywood Bowl", event_date: new Date("2019-08-31T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'John Williams', location: "Hollywood Bowl", event_date: new Date("2019-09-01T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'John Williams', location: "Hollywood Bowl", event_date: new Date("2019-09-02T02:30:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Stravinsky', location: "Hollywood Bowl", event_date: new Date("2019-09-04T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Mozart Under the Stars', location: "Hollywood Bowl", event_date: new Date("2019-09-06T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Barry Manilow', location: "Hollywood Bowl", event_date: new Date("2019-09-07T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Barry Manilow', location: "Hollywood Bowl", event_date: new Date("2019-09-08T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Gladys Night', location: "Hollywood Bowl", event_date: new Date("2019-09-09T02:30:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Heart: Love Alive Tour', location: "Hollywood Bowl", event_date: new Date("2019-09-10T02:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Ravel with Thibaudet', location: "Hollywood Bowl", event_date: new Date("2019-09-11T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Ben Harper', location: "Hollywood Bowl", event_date: new Date("2019-09-12T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'An American in Paris', location: "Hollywood Bowl", event_date: new Date("2019-09-13T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Fireworks Finale Earth Wind & Fire', location: "Hollywood Bowl", event_date: new Date("2019-09-14T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Fireworks Finale Earth Wind & Fire', location: "Hollywood Bowl", event_date: new Date("2019-09-15T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Cafe Tacvba', location: "Hollywood Bowl", event_date: new Date("2019-09-16T02:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Sound of Music Sing a long', location: "Hollywood Bowl", event_date: new Date("2019-09-22T01:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Black Movie Soundtrack III', location: "Hollywood Bowl", event_date: new Date("2019-09-26T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Rod Stewart', location: "Hollywood Bowl", event_date: new Date("2019-09-28T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Gary Clark Jr.', location: "Hollywood Bowl", event_date: new Date("2019-09-30T02:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Vampire Weekend: Father Of The Bride Tour', location: "Hollywood Bowl", event_date: new Date("2019-10-03T01:30:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Marco Antonio Solis: La Historia Continua 2019', location: "Hollywood Bowl", event_date: new Date("2019-10-05T03:00:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'The Who: Moving On!', location: "Hollywood Bowl", event_date: new Date("2019-10-12T02:30:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'The Who: Moving On!', location: "Hollywood Bowl", event_date: new Date("2019-10-14T02:30:00Z"), created_at: new Date(), modified_at: new Date()},
  { name: 'Sara Bareilles: Amidst The Chaos Tour 2019', location: "Hollywood Bowl", event_date: new Date("2019-11-03T03:00:00Z"), created_at: new Date(), modified_at: new Date()}
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
