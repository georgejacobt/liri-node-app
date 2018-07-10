require("dotenv").config();
const fs = require("fs");

let keys = require("./keys");
let twitter = require("twitter");
let spotifyApp = require("node-spotify-api");
let request = require('request');


var client = new twitter(keys.twitter);
var spotify = new spotifyApp(keys.spotify);

let action = process.argv[2];
let maxTweets = 10;

if (action == "do-what-it-says"){
    let readInput = fs.readFileSync("./random.txt","utf8").split(",");

    let actionInput = readInput[0];
    let secondArg = readInput[1];
 

    switch(actionInput){
    case "spotify-this-song":
    spotifyThis (secondArg);
    break;

    case "my-tweets":
    tweetThis ();
    break;

    case "movie-this":
    movieThis (secondArg);
    break;

    default:
    console.log("not a valid action");
    }
    
} else {

    switch(action){
        case "spotify-this-song":
        let song = process.argv[3];
        spotifyThis (song);
        break;

        case "my-tweets":
        tweetThis ();
        break;

        case "movie-this":
        let movieName = process.argv[3];
        movieThis (movieName);
        break;
    
        default:
        console.log("not a valid action");
        }

}

function spotifyThis (secondArg){
    let song = secondArg;
    
    // spotify API actions start
        spotify
      .search({ type: 'track', query: song })
      .then(function(response) {
        let jsonData = JSON.stringify(response);
        fs.writeFileSync("./data.json", jsonData, "utf8" );
        // console.log("filewrittensuccess");
        // console.log("stepafterfilewrite");
        let config = require('./data.json');
        console.log("****SpotifyDataStart****")
        console.log("Song:"+song);
        let resultsNum = config.tracks.items.length;
        if (resultsNum == 0){console.log ("No tracks found! Try again!")
        console.log("****SpotifyDataEnd****") }
        else{
        console.log("Artist(s):"+config.tracks.items[0].album.artists[0].name);
        console.log("Album:"+config.tracks.items[0].album.name);
        console.log("URL:"+config.tracks.items[0].album.external_urls.spotify);
        console.log("****SpotifyDataEnd****")  
        }
        
      })
      .catch(function(err) {
        console.log(err);
      });
}

function tweetThis (){
    console.log("tweets go here");
    var params = {screen_name: 'gjDev1'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
    let jsonTweetData = JSON.stringify(tweets);
    fs.writeFileSync("./dataTweets.json", jsonTweetData, "utf8" );
    let configTweets = require('./dataTweets.json');
   
    let counter = 1;
    if (configTweets.length < maxTweets){
         console.log("****TwitterDataStart:Displaying latest "+ maxTweets + " tweets for "+ params.screen_name + " ****");
        for (i=0; i < configTweets.length; i++){
      console.log("Tweet #"+ counter +":"+configTweets[i].text);  
      counter++ ;
    }
    console.log("****TwitterDataEnd****");
    } else {
        console.log("****TwitterDataStart:Displaying latest "+maxTweets + " tweets for "+ params.screen_name + " ****");
        for (i=0; i < maxTweets ; i++){
            console.log("Tweet #"+ counter +":"+configTweets[i].text);  
            counter++ ;
        }
        console.log("****TwitterDataEnd****");

    }
  } else console.error(error);
});
}

function movieThis (secondArg){
    console.log(secondArg);
    let movieName = secondArg;
    if (movieName == undefined) {
        movieName = "Mr. Nobody"
    }
    console.log("Loading OMDB Data for: "+ movieName +"....");
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {
        // If the request was successful...
        if (!error && response.statusCode === 200) {
          // Then log the body from the site!
        //   console.log(JSON.stringify(body));
        if (JSON.parse(body).Title != undefined){
            console.log("Title: "+JSON.parse(body).Title);
          console.log("Year: "+JSON.parse(body).Year);
          console.log("Genre: "+JSON.parse(body).Genre);

          let ratingsCount = JSON.parse(body).Ratings.length;
        //   console.log(ratingsCount);

        if (ratingsCount > 2){
        for (i=0 ; i < 2; i++ ){
            console.log(JSON.parse(body).Ratings[i].Source+ " (Rating): " +JSON.parse(body).Ratings[i].Value);
        }
        } else if (ratingsCount > 0) {
            for (i=0 ; i < 1; i++ ){
                console.log(JSON.parse(body).Ratings[i].Source+ " (Rating): " +JSON.parse(body).Ratings[i].Value);
            }
        } else (console.log("Rating: N/A"));
          
          console.log("Country Produced: "+JSON.parse(body).Country);
          console.log("The Plot: "+JSON.parse(body).Plot);
          console.log("Actors: "+JSON.parse(body).Actors);
        } else (console.log("Oops! No movie data available"));
    
        } else {console.error(error)}
         
      });
}





