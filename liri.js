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

  // spotify API Function
function spotifyThis (secondArg){
    let song = secondArg;

    if (song == undefined) {
        song = "The Sign"
    }
    
        spotify
      .search({ type: 'track', query: song })
      .then(function(response) {
        let jsonData = JSON.stringify(response);
        fs.writeFileSync("./data.json", jsonData, "utf8" );
        let config = require('./data.json');
        console.log("****SpotifyDataStart****");
        fs.appendFileSync("log.txt","****SpotifyDataStart****"+'\n');

        console.log("Song:"+song);
        fs.appendFileSync("log.txt","Song:"+song+'\n');

        let resultsNum = config.tracks.items.length;
        if (resultsNum == 0)
        {console.log ("No tracks found! Try again!") //error check if no tracks exist
        fs.appendFileSync("log.txt","No tracks found! Try again!"+'\n');
        console.log("****SpotifyDataEnd****"+'\n')
        fs.appendFileSync("log.txt","****SpotifyDataEnd****"+'\n'+'\n'); }
        else{
        console.log("Artist(s):"+config.tracks.items[0].album.artists[0].name);
        fs.appendFileSync("log.txt","Artist(s):"+config.tracks.items[0].album.artists[0].name +'\n');
        console.log("Album:"+config.tracks.items[0].album.name);
        fs.appendFileSync("log.txt","Album:"+config.tracks.items[0].album.name +'\n');
        console.log("URL:"+config.tracks.items[0].album.external_urls.spotify);
        fs.appendFileSync("log.txt","URL:"+config.tracks.items[0].album.external_urls.spotify +'\n');
        console.log("****SpotifyDataEnd****");
        fs.appendFileSync("log.txt","****SpotifyDataEnd****"+'\n'+'\n'); 
        }
        
      })
      .catch(function(err) {
        console.log(err);
      });
}


// Twitter API Function
function tweetThis (){
    
    var params = {screen_name: 'gjDev1'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
    let jsonTweetData = JSON.stringify(tweets);
    fs.writeFileSync("./dataTweets.json", jsonTweetData, "utf8" );
    let configTweets = require('./dataTweets.json');
   
    let counter = 1;
    if (configTweets.length < maxTweets){
         console.log("****TwitterDataStart:Displaying latest "+ maxTweets + " tweets for "+ params.screen_name + " ****");
         fs.appendFileSync("log.txt","****TwitterDataStart:Displaying latest "+ maxTweets + " tweets for "+ params.screen_name + " ****"+'\n'); 
        for (i=0; i < configTweets.length; i++){
      console.log("Tweet #"+ counter +":"+configTweets[i].text);  
      fs.appendFileSync("log.txt","Tweet #"+ counter +":"+configTweets[i].text +'\n'); 
      counter++ ;
    }
    console.log("****TwitterDataEnd****");
    fs.appendFileSync("log.txt","****TwitterDataEnd****" +'\n');
    } else {
        console.log("****TwitterDataStart:Displaying latest "+maxTweets + " tweets for "+ params.screen_name + " ****");
        fs.appendFileSync("log.txt","****TwitterDataStart:Displaying latest "+maxTweets + " tweets for "+ params.screen_name + " ****" +'\n');
        for (i=0; i < maxTweets ; i++){
            console.log("Tweet #"+ counter +":"+configTweets[i].text);  
            fs.appendFileSync("log.txt","Tweet #"+ counter +":"+configTweets[i].text +'\n');
            counter++ ;
        }
        console.log("****TwitterDataEnd****");
        fs.appendFileSync("log.txt","****TwitterDataEnd****" +'\n'+'\n');

    }
  } else { console.error(error);
           fs.appendFileSync("log.txt",error +'\n');       }
});
}


// OMDB API Function
function movieThis (secondArg){
    
    let movieName = secondArg;
    if (movieName == undefined) {
        movieName = "Mr. Nobody"
    }

    console.log("****Loading OMDB Data for: "+ movieName +"....*****");
    fs.appendFileSync("log.txt","****Loading OMDB Data for: "+ movieName +"....****" +'\n');
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {
        // If the request was successful...
        if (!error && response.statusCode === 200) {
          // Then log the body from the site!
    
        if (JSON.parse(body).Title != undefined){ // error check for junk data input
          console.log("Title: "+JSON.parse(body).Title);
          fs.appendFileSync("log.txt","Title: "+JSON.parse(body).Title +'\n');
          console.log("Year: "+JSON.parse(body).Year);
          fs.appendFileSync("log.txt","Year: "+JSON.parse(body).Year +'\n');
          console.log("Genre: "+JSON.parse(body).Genre);
          fs.appendFileSync("log.txt","Genre: "+JSON.parse(body).Genre +'\n');

          let ratingsCount = JSON.parse(body).Ratings.length;
        
        // ensuring no errors are returned for movies that do not have the required ratings data
        if (ratingsCount > 2){ 
        for (i=0 ; i < 2; i++ ){
            console.log(JSON.parse(body).Ratings[i].Source+ " (Rating): " +JSON.parse(body).Ratings[i].Value);
            fs.appendFileSync("log.txt",JSON.parse(body).Ratings[i].Source+ " (Rating): " +JSON.parse(body).Ratings[i].Value +'\n');
        }
        } else if (ratingsCount > 0) {
            for (i=0 ; i < 1; i++ ){
                console.log(JSON.parse(body).Ratings[i].Source+ " (Rating): " +JSON.parse(body).Ratings[i].Value);
                fs.appendFileSync("log.txt",JSON.parse(body).Ratings[i].Source+ " (Rating): " +JSON.parse(body).Ratings[i].Value +'\n');
            }
        } else {
            (console.log("Rating: N/A"));
            fs.appendFileSync("log.txt","Rating: N/A" +'\n');
             }
          
          console.log("Country Produced: "+JSON.parse(body).Country);
          fs.appendFileSync("log.txt","Country Produced: "+JSON.parse(body).Country +'\n');
          console.log("The Plot: "+JSON.parse(body).Plot);
          fs.appendFileSync("log.txt","The Plot: "+JSON.parse(body).Plot +'\n');
          console.log("Actors: "+JSON.parse(body).Actors);
          fs.appendFileSync("log.txt","Actors: "+JSON.parse(body).Actors +'\n');

          console.log("****OMDBDataEnd****");
        fs.appendFileSync("log.txt","****OMDBDataEnd****" +'\n'+'\n');
        } else{
               (console.log("Oops! No movie data available"));
               fs.appendFileSync("log.txt","Oops! No movie data available" +'\n');
               console.log("****OMDBDataEnd****");
               fs.appendFileSync("log.txt","****OMDBDataEnd****" +'\n'+'\n');
              }
    
        } else {console.error(error)
            fs.appendFileSync("log.txt",error +'\n'+'\n');  }
         
      });
}





