// Include the axios npm package
var axios = require("axios");

// Include the inquirer npm package
var inquirer = require("inquirer");

//Code to read and set any environment variables with the dotenv package
// Include the dotenv npm package
require("dotenv").config();

//Code required to import the keys.js file and store it in a variable
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');

//Access keys information
var spotify = new Spotify(keys.spotify);

// Include the moment npm package
var moment = require('moment');


//liri.js can take in one of the following commands:
// 1. concert-this (e.g. node liri.js concert-this <artist/band name here>)
// 2. spotify-this-song (e.g. node liri.js spotify-this-song '<song name here>')
// 3. movie-this (e.g. node liri.js movie-this '<movie name here>')
// 4. do-what-it-says (e.g. node liri.js do-what-it-says)

//Take user input
inquirer.prompt([ 
    {
        type: "list",
        message: "Enter your choice of liri search?",
        choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "liriSearch"
    }
])
.then(function(inquirerResponse){

    console.log("Welcome to the Liri App !!!");

    switch(inquirerResponse.liriSearch) {
        
        case "concert-this":
            console.log("You have selected to know about events");
            concertThis();
            break;

        case "spotify-this-song":
            console.log("You have selected to do a Spotify search");
            spotifyThisSong();
            break;
        
        case "movie-this":
            console.log("You have selected to know about a movie");
            movieThis();
            break;
        
        case "do-what-it-says":
            console.log("You have selected 'do-what-it-says'");
            doWhatItSays();
            break;

        default:
            console.log("Invalide user input!");
    }

})            
.catch(function(err) {
    console.log(err);
});;

/*************************************************************************************************
 * Function: concertThis()
 * This function calls Bands In Town API with artist name taken as user input and creating query
 *************************************************************************************************/

function concertThis() {

    console.log("Inside concertThis()");

    inquirer.prompt([ 
        {
            type: "input",
            message: "Enter artist name you want to search?",
            name: "artist"
        }
    ])
    .then(function(artistResp){

        let artistName = artistResp.artist;

        let queryUrl = `https://rest.bandsintown.com/artists/${artistName}/events?app_id="6e95880a-cca7-4c54-957a-290bd8f52183"`;
        // console.log("queryUrl: " + queryUrl);
        
        // Run a request with axios to the "Bands In Town" API with the specified artist name
        axios
            .get(queryUrl)
            .then(function(eventResp) {

                //If there are no events 
                if(eventResp.data.length === 0) {
                    console.log(`No events found for ${artistName} to be held in US soon.`);
                    return;
                }
                    

                console.log(`Below are the details of ${artistName}'s events to be held in US:`);

                //Loop through the event objects to display the required fields
                for(let eventNo=0 ; eventNo<eventResp.data.length ; eventNo++) {

                    //Show events that are only in United States
                    if(eventResp.data[eventNo].venue.country !== "United States") {
                        continue; //Moveon to the next event
                    }
                    
                    //By default show only top 10 results from the response
                    if(eventNo >= 10)
                        break; //break the for loop if we have displayed top 10 events

                    console.log("\n");

                    // Name of the venue
                    console.log(`Name of the venue: ${eventResp.data[eventNo].venue.name}`);
    
                    // Venue location
                    console.log(`Venue location: ${eventResp.data[eventNo].venue.city}, ${eventResp.data[eventNo].venue.country}`);
    
                    // Date of the Event (use moment to format this as "MM/DD/YYYY")
                    var dateToBeConverted = moment(eventResp.data[eventNo].datetime, "YYYY-MM-DDTHH:mm:ss");
                    console.log(`Date of the Event: ${dateToBeConverted.format("MM/DD/YYYY")}`);
                }
            })
            .catch(function(err) {
                console.log(err);
            });
      
    })
    .catch(function(err) {
        console.log(err);
    });

} //End of concertThis()


/*************************************************************************************************
 * Function: spotifyThisSong()
 * This function calls Spotify API with artist name taken as user input and creating query
 *************************************************************************************************/
function spotifyThisSong() {

    console.log("Inside spotifyThisSong()");

    inquirer.prompt([ 
        {
            type: "input",
            message: "Enter artist/band name you want to search?",
            name: "artistOrBandName"
        }
    ])
    .then(function(artistOrBandNameResp){

        let artist = artistOrBandNameResp.artistOrBandName;

        //If user does not enter a valid song then set default value to "The Sign" by Ace of Base.
        if(artist === "") {
            artist = "The Sign, Ace of Base";
        }

        spotify
            .search({ type: 'track', query: artist, limit: 10 })
            .then(function(response) {

                for(let i=0 ; i<10 ; i++) {

                    console.log("\n");

                    //Show Artist(s)
                    let getArtists = response.tracks.items[i].artists;
                    let artistsName = [];
                    for(let j=0 ; j<getArtists.length ; j++) {
                        artistsName += getArtists[j].name + "  ";
                    }
                    console.log("Artist/s: " + artistsName);

                    // The song's name
                    console.log("Song's name: " + response.tracks.items[i].name);

                    // A preview link of the song from Spotify
                    console.log("Preview URL: " + response.tracks.items[i].preview_url);
                    
                    // The album that the song is from
                    console.log("Album name: " + response.tracks.items[i].album.name);

                }
            })
            .catch(function(err) {
                console.log(err);
            });
    })
    .catch(function(err) {
        console.log(err);
    });    


} //End of spotifyThisSong()


/*************************************************************************************************
 * Function: movieThis()
 * This function calls OMDB API with movie name taken as user input and creating query
 *************************************************************************************************/
function movieThis() {

    console.log("Inside movieThis()");

    inquirer.prompt([ 
        {
            type: "input",
            message: "Enter movie you want to search?",
            name: "movie"
        }
    ])
    .then(function(response){

        let movie = response.movie;

        //If user did not enter a movie name then by default set movie to "Mr. Nobody"
        if(movie === "") {
            console.log("\n");
            console.log("User input left blank!! Thus, showing details of 'Mr. Nobody'");
            movie = "Mr. Nobody";
        }
            

        let queryUrl = `http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy`;
        // console.log("queryUrl: " + queryUrl);

        // Then run a request with axios to the OMDB API with the movie specified
        axios
            .get(queryUrl)
            .then(function(response) {

                //Check if omdb server response is null
                if(response.data === "") {
                    return console.log("Movie not found !!");
                }
    
                console.log("\n");
                console.log(`Title of the movie: ${response.data.Title}`);
                console.log(`Year the movie came out: ${response.data.Year}`);
                console.log(`IMDB Rating of the movie: ${response.data.imdbRating}`);
                console.log(`Rotten Tomatoes Rating of the movie: ${response.data.Ratings[1].Value}`);
                console.log(`Country where the movie was produced: ${response.data.Country}`);
                console.log(`Language of the movie: ${response.data.Language}`);
                console.log(`Plot of the movie: ${response.data.Plot}`);
                console.log(`Actors in the movie: ${response.data.Actors}`);

            })
            .catch(function(err) {
                console.log(err);
            }); 

    })
    .catch(function(err) {
        console.log(err);
    });    
    
} //End of movieThis()



/*************************************************************************************************
 * Function: doWhatItSays()
 * 
 *************************************************************************************************/
function doWhatItSays() {
    
} //End of doWhatItSays()


