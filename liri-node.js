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
var dataToAdd=[];


/////////////////////////////////////////////////////////////////////
if (command == "do-what-it-says") {

  fs.readFile("random.txt", "utf8", function (error, data) {
    var a=data.indexOf(",");
    command=data.slice(0,(a)); 
    input=data.slice(a+1);
    console.log(command);
    console.log(input);
    search();
  });

}
else {search()}

function search() {  

//////////////////////////////////////////////////////TWITTER

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
        console.log ("Result " + (i+1));
        console.log ("**********")
        console.log(info);
        console.log ("");
      }

    }
  });

///////////////////////////////////////////////////////SPOTIFY 

} 

  else if (command == 'spotify-this-song') {

    ///flag undefined input

    if (typeof input == 'undefined') {
      flag = true;
      input = "sign";
    }

    /// Run search

    spotify.search({
      type: 'track',
      query: input
    }, function(err, data) {
      if (err) {
        console.log('Error occurred: ' + err);
        return;
      }

      /// if undefined, run default, which is the artist "ace of base", then return its results

      if (flag && input == "sign") {

        //show results: 
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
      } 

      /// if search term included, find it. 

    else {
      //this capitalizes the first letter
      var input1 = input[0].toUpperCase() + input.substring(1);

      //show results: 
      for (i = 0; i < data.tracks.items.length; i++) {
        // if ((data.tracks.items[i].name).includes(input1)) {
            console.log(i);
          // var artist=data.tracks.items[i].album.artists[0].name;
          // dataToAdd.push(artist);
          // var album =data.tracks.items[i].album.name;
          // dataToAdd.push(album);
          // var song = data.tracks.items[i].name;
          // dataToAdd.push(song);
          // var preview = data.tracks.items[i].preview_url;
          // dataToAdd.push(preview);

          // console.log(dataToAdd);
          console.log("Result " + (i + 1));
          console.log("===========");
          console.log("The artist: " + data.tracks.items[i].album.artists[0].name);
          console.log("The album name: " + data.tracks.items[i].album.name);
          console.log("The song's name: " + data.tracks.items[i].name);
          console.log("A preview link of the song from Spotify: " + data.tracks.items[i].preview_url);
          console.log("");

        
        // }//if
      } // for ends
    }//else

  });//function

} //end spotify

/////////////////////////////////////////////////////////////////
else if (command == 'movie-this') {

  if (typeof input == 'undefined') {
    input = "Mr. Nobody";
  }

  request("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&r=json", function(error, response, body) {

    // If there were no errors and the response code was 200 (i.e. the request was successful)...
    if (!error && response.statusCode === 200) {

      

      console.log("The movie's title is: " + JSON.parse(body).Title);
      console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
      console.log("The country where the movie was produced: " + JSON.parse(body).Country);
      console.log("The language of the movie: " + JSON.parse(body).Language);
      console.log("The plot of the movie is: " + JSON.parse(body).Plot);
      console.log("The actors in the movie are: " + JSON.parse(body).Actors);
      console.log("The Rotten Tomatoes URL is ???");
    } 
      else if (error) {
        console.log(error);
         }
  }); //request

} //movie ends
///////////////////////////
 
  // fs.appendFile("log.txt", dataToAdd, function(err) {
  //   if (err) { 
  //     console.log(err)
  //   }
  //     else {
  //       console.log("content added")
  //     }
  //   });
 
     // dataToAdd=[];
}//search()

// ### BONUS

// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.

// * Make sure you append each command you run to the `log.txt` file. 

// * Do not overwrite your file each time you run a command.

// - - - 