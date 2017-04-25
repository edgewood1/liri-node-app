var liri = require("./keys.js");

var consumerKey = liri.twitterKeys.consumer_key;
var consumerSecret = liri.twitterKeys.consumer_secret;
var accessTokenKey = liri.twitterKeys.access_token_key;
var accessTokenSecret = liri.twitterKeys.access_token_secret;

var command = process.argv[2];
var input = process.argv[3];
var flag;

var request = require("request");
var Twitter = require("twitter");
var spotify = require("spotify");
var fs = require("fs");

/////////////////////////////////////////////////////////////////////

if (command == "my-tweets") {

  var client = new Twitter({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    access_token_key: accessTokenKey,
    access_token_secret: accessTokenSecret
  });

  var params = {
    screen_name: 'nodejs'
  };
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (i = 0; i < 10; i++) {
        var info = tweets[i].text;
        // var info=JSON.stringify(tweets, null, 2);
        console.log(info);
      }

    }
  });

  // * This will show your last 20 tweets and when they were created at in your terminal/bash window.

} else if (command == 'spotify-this-song') {

  if (typeof input == 'undefined') {
    flag = true;
    input = "sign";

  }

  spotify.search({
    type: 'track',
    query: input
  }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }

    if (flag && input == "sign") {
      // search through results for the artist "ace of base", then return its results

      for (i = 0; i < data.tracks.items.length; i++) {

        if (data.tracks.items[i].album.artists[0].name == "Ace of Base") {
          console.log(i);
          console.log("Result " + (i + 1));
          console.log("===========");
          console.log("The artist: " + data.tracks.items[i].album.artists[0].name);
          console.log("The album name: " + data.tracks.items[i].album.name);
          console.log("The song's name: " + data.tracks.items[i].name);
          console.log("A preview link of the song from Spotify: " + data.tracks.items[i].preview_url);
          console.log("");
        }

      }

    } else {
      var input1 = input[0].toUpperCase() + input.substring(1);

      for (i = 0; i < data.tracks.items.length; i++) {
        if ((data.tracks.items[i].name).includes(input1)) {
          console.log("Result " + (i + 1));
          console.log("===========");
          console.log("The artist: " + data.tracks.items[i].album.artists[0].name);
          console.log("The album name: " + data.tracks.items[i].album.name);
          console.log("The song's name: " + data.tracks.items[i].name);
          console.log("A preview link of the song from Spotify: " + data.tracks.items[i].preview_url);
          console.log("");
        }
      }
    }

  });

}

/////////////////////////////////////////////////////////////////
else if (command == 'movie-this') {

  if (typeof input == 'undefined') {
    input = "Mr. Nobody";
  }

  request("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&r=json", function(error, response, body) {

    // If there were no errors and the response code was 200 (i.e. the request was successful)...
    if (!error && response.statusCode === 200) {

      console.log(JSON.parse(body));

      console.log("The movie's title is: " + JSON.parse(body).Title);
      console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
      console.log("The country where the movie was produced: " + JSON.parse(body).Country);
      console.log("The language of the movie: " + JSON.parse(body).Language);
      console.log("The plot of the movie is: " + JSON.parse(body).Plot);
      console.log("The actors in the movie are: " + JSON.parse(body).Actors);
      console.log("The Rotten Tomatoes URL is ???");
    } else if (errror) {
      console.log(error);
    }
  });

} else if (command == "do-what-it-says") {

  fs.read("random.txt", "utf8", function (error, input) {
 spotify.search({
    type: 'track',
    query: input
  }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }

         var input1 = input[0].toUpperCase() + input.substring(1);

      for (i = 0; i < data.tracks.items.length; i++) {
        if ((data.tracks.items[i].name).includes(input1)) {
          console.log("Result " + (i + 1));
          console.log("===========");
          console.log("The artist: " + data.tracks.items[i].album.artists[0].name);
          console.log("The album name: " + data.tracks.items[i].album.name);
          console.log("The song's name: " + data.tracks.items[i].name);
          console.log("A preview link of the song from Spotify: " + data.tracks.items[i].preview_url);
          console.log("");
        }
      }
  })
  // * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
  //     * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
  //     * Feel free to change the text in that document to test out the feature for other commands.
}

// ### BONUS

// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.

// * Make sure you append each command you run to the `log.txt` file. 

// * Do not overwrite your file each time you run a command.

// - - - 