require("dotenv").config();
const fs = require("fs");

let keys = require("./keys");
let twitter = require("twitter");
let spotifyApp = require("node-spotify-api");

var client = new twitter(keys.twitter);
var spotify = new spotifyApp(keys.spotify);

let action = process.argv[2];


switch(action) {
    case "spotify-this-song":
    let song = process.argv[3];
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
    console.log("Artist(s):"+config.tracks.items[0].album.artists[0].name);
    console.log("Album:"+config.tracks.items[0].album.name);
    console.log("URL:"+config.tracks.items[0].album.external_urls.spotify);
    console.log("****SpotifyDataEnd****")
  })
  .catch(function(err) {
    console.log(err);
  });
  // spotify API actions ends
   
    break;

    case "my-tweets":
    console.log(" tweets go here");
    break;

    default:
    console.log("not a vliad action")
}




