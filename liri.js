// Import all npm packages

require("dotenv").config();


var Twitter = require("twitter");


var Spotify = require("node-spotify-api");


var keys = require("./keys");


var request = require("request");


var fs = require("fs");


var spotify = new Spotify(keys.spotify);

// Twitter Search function
var myTweets = function() {
  var client = new Twitter(keys.twitter);

  var params = {
    screen_name: "thatduder",
    count: 5
  };
  client.get("statuses/user_timeline", params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; tweets.length; i++) {
        console.log("");
        console.log("-------------------");
        console.log("Created At: " + tweets[i].created_at);
        console.log("");
        console.log("Tweet: " + tweets[i].text);
        console.log("-------------------");
        console.log("");
      }
    }
  });
};

// Writes to the log.txt file
var getArtistNames = function(artist) {
    return artist.name;
  };
  
  // Spotify Search function
  var mySpotify = function(song) {
    if (song === undefined) {
      song = "Purple Rain";
    }
  
    spotify.search(
      {
        type: "track",
        query: song,
        limit: 5
      },
      function(err, data) {
        if (err) {
          console.log("Error occurred: " + err);
          return;
        }
  
        var songs = data.tracks.items;
  
        for (var i = 0; i < songs.length; i++) {
          console.log(i);
          console.log("artist(s): " + songs[i].artists.map(getArtistNames));
          console.log("------------------------------");
          console.log("song name: " + songs[i].name);
          console.log("------------------------------");
          console.log("preview song: " + songs[i].preview_url);
          console.log("------------------------------");
          console.log("album: " + songs[i].album.name);
          console.log("-----------------------------------");
        }
      }
    );
  };

// OMBD Movie Search function
var myMovie = function(movie) {
  if (movie === undefined) {
    movie = "Jaws";
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
    }
  });
};

// Function for running a command based on text file
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      choices(dataArr[0], dataArr[1]);
    }
    else if (dataArr.length === 1) {
      choices(dataArr[0]);
    }
  });
};

// Function for determining which command is executed
var choices = function(caseData, functionData) {
  switch (caseData) {
  case "my-tweets":
    myTweets();
    break;
  case "spotify-this-song":
    mySpotify(functionData);
    break;
  case "movie-this":
    myMovie(functionData);
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("Error, not valid command");
  }
};

// chooses the argument from the user to be run 
var runThis = function(arg1, arg2) {
  choices(arg1, arg2);
};

// function that chooses the argument for either twitter, spotify, or OMBD searches
runThis(process.argv[2], process.argv[3]);
