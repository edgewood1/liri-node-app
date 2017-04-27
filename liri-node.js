//fix read in order to better read past searches. 

//requires

var liri = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var spotify = require("spotify");
var fs = require("fs");

//keys for twitter

var consumerKey = liri.twitterKeys.consumer_key;
var consumerSecret = liri.twitterKeys.consumer_secret;
var accessTokenKey = liri.twitterKeys.access_token_key;
var accessTokenSecret = liri.twitterKeys.access_token_secret;

//variables

var command = process.argv[2];
var input = process.argv[3];
var flag;

//constructor

function SaveData() {
  // this.Name = name;
  this.data = [];
  this.addData = function(item) {
    this.data.push(item); //error
  };
}

var twitter = new SaveData();
var spotify1 = new SaveData();
var movie = new SaveData();

/////////////////////////////////////////////////////////READ RANDOM.TXT FILE ////////////
if (command === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function(error, data) {
    var a = data.indexOf(",");
    command = data.slice(0, a);
    input = data.slice(a + 1);
    console.log(command);
    console.log(input);
    search();
  });
} else {
  search();
}

function search() {
  //////////////////////////////////////////////////////TWITTER

  if (command === "my-tweets") {
    var client = new Twitter({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      access_token_key: accessTokenKey,
      access_token_secret: accessTokenSecret
    });

    var params = {
      screen_name: "nodejs"
    };
    client.get("statuses/user_timeline", params, function(
      error,
      tweets,
      response
    ) {
      if (!error) {
        for (i = 0; i < 10; i++) {
          var info = tweets[i].text;
          console.log("Result " + (i + 1));
          console.log("**********");
          console.log(info);
          console.log("");
          twitter.addData(info);
        } //end for
        write(twitter.data);
      } //end if
    });
  } 
  //////////////////////////////////////////////READ
  else if (command === "read") {
  
    read();
  } 
  /////////////////////////////////////////////CLEAR
  else if (command === "clear") {
    fs.writeFile("log.txt", " ", function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("log.txt is cleared");
      }
    });
  } 

  ///////////////////////////////////////////////////////SPOTIFY
  else if (command === "spotify-this-song") {
    
    if (typeof input === "undefined") {
      flag = true;
      input = "sign";
    }

    /// Run search
    spotify.search(
      {
        type: "track",
        query: input
      },
      function(err, data) {
        if (err) {
          console.log("Error occurred: " + err);
          return;
        }

        /// if undefined, run default, which is the artist "ace of base", then return its results

        if (flag && input === "sign") {
          //show results:
          for (i = 0; i < data.tracks.items.length; i++) {
            if (data.tracks.items[i].album.artists[0].name === "Ace of Base") {
              console.log(i);
              console.log("Result " + (i + 1));
              console.log("============");
              console.log(
                "The artist: " + data.tracks.items[i].album.artists[0].name
              );
              console.log("The album name: " + data.tracks.items[i].album.name);
              console.log("The song's name: " + data.tracks.items[i].name);
              console.log(
                "A preview link of the song from Spotify: " +
                  data.tracks.items[i].preview_url
              );
              console.log("");
            }
          }
        } 
        else {
          /// if search term included, find it.
          //this capitalizes the first letter
          var input1 = input[0].toUpperCase() + input.substring(1);

          //show results:
          for (i = 0; i < data.tracks.items.length; i++) {
            // if ((data.tracks.items[i].name).includes(input1)) {

            var artist = data.tracks.items[i].album.artists[0].name;
            spotify1.addData(artist);
            var album = data.tracks.items[i].album.name;
            spotify1.addData(album);
            var song = data.tracks.items[i].name;
            spotify1.addData(song);
            var preview = data.tracks.items[i].preview_url;
            spotify1.addData(preview);

            console.log("Result " + (i + 1));
            console.log("============");
            console.log("The artist: " + artist);
            console.log("The album name: " + album);
            console.log("The song's name: " + song);
            console.log("A preview link of the song from Spotify: " + preview);
          } // for ends
          write(spotify1.data);
        } //else
      }
    ); //function
  } 
  //////////////////////////////////////////////////////////movie
  else if (command === "movie-this") {
    
    if (typeof input === "undefined") {
      input = "Mr. Nobody";
    }

    request(
      "http://www.omdbapi.com/?t=" +
        input +
        "&y=&plot=short&r=json&tomatoes=true",
      function(error, response, body) {
        // If there were no errors and the response code was 200 (i.e. the request was successful)...
        if (!error && response.statusCode === 200) {
          var title = JSON.parse(body).Title;
          var rating = JSON.parse(body).imdbRating;
          var country = JSON.parse(body).Country;
          var language = JSON.parse(body).Language;
          var plot = JSON.parse(body).Plot;
          var actors = JSON.parse(body).Actors;
          var tUrl = JSON.parse(body).tomatoURL;

          console.log("The movie's title is: " + title);
          console.log("The movie's rating is: " + rating);
          console.log("The country where the movie was produced: " + country);
          console.log("The language of the movie: " + language);
          console.log("The plot of the movie is: " + plot);
          console.log("The actors in the movie are: " + actors);
          console.log("The Rotten Tomatoes URL is: " + tUrl);

          movie.addData(title);
          movie.addData(rating);
          movie.addData(country);
          movie.addData(language);
          movie.addData(plot);
          movie.addData(actors);
          movie.addData(tUrl);
          write(movie.data);
        } 
        else if (error) {
          console.log(error);
        }
      }
    ); //request
  } //movie ends
} //search()

///////////////////////////Write
function write(info) {
  
  fs.appendFile("log.txt", info, function(err) {
    if (err) {
      console.log(err);
    } else {
  
      console.log("content added to log.txt");
     
    }
  }); //end function
} //end write

////////////////////////////reads
function read() {
  fs.readFile("log.txt", "utf8", function(error, data) {
    var dataArr = data.split(",");
    for (i = 0; i < dataArr.length; i++) {
      console.log(dataArr[i]);
    }
  });
}
