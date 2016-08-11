var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

var songs = []; //stores our songs

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: true }));
/**
 * POST /songs
 *
 * Places song into songs array
 */
app.post('/songs', function (req, res) {
  var song = req.body;
  // no blanks
  if(song.title == '' || song.artist == '') {
    console.log('blanks');
    res.sendStatus(400);
  } else {
    // no dupes
    if(isDuplicateSong(song)) {
      console.log('dupe: ', song);
      res.sendStatus(400);
    } else {
      // all good
      song = addDate(song);
      songs.push(song);
      res.sendStatus(201);
    }
  }
});

app.get('/songs', function (req, res) {
  res.send(songs);
});

function addDate(theSong) {
  var now = new Date();
  theSong.dateAdded = now;
  return theSong;
}

function isDuplicateSong(check) {
  for(var i = 0; i < songs.length; i++) {
    console.log(songs[i], check);
    if((songs[i].title == check.title) && (songs[i].artist == check.artist)) {
      console.log('are dupes');
      return true;
    }
  }

  return false;
}

app.get('/*', function (req, res) {
  var file = req.params[0] || '/views/index.html';

  // console.log('What is in req.params[0]?', req.params[0]);

  //console.log('dirname: ', __dirname);
  //console.log('path', path.join(__dirname, '../public', file));
  res.sendFile(path.join(__dirname, './public', file));
});

app.listen(app.get('port'), function () {
  console.log('Server now running at port ', app.get('port'));
});
