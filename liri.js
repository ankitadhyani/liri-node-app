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

function startApp() {

    //Take user input
    inquirer.prompt({
            type: "list",
            message: "Enter your choice of liri search?",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "liriSearch"
        })
        .then(function (inquirerResponse) {

            //Call function with user option to execute desired operation
            liriSearch(inquirerResponse.liriSearch, "");

        })
        .catch(function (err) {
            console.log(err);
        });


} //End of startApp()


/*************************************************************************************************
 * Function: liriSearch()
 * This function redirects code flow to the respective action to be performed based on input parameter
 *************************************************************************************************/

function liriSearch(option, searchFor) {

    switch (option) {

        case "concert-this":
            console.log("\nYou have selected to know about events\n");
            concertThis(searchFor);
            break;

        case "spotify-this-song":
            console.log("\nYou have selected to do a Spotify search\n");
            spotifyThisSong(searchFor);
            break;

        case "movie-this":
            console.log("\nYou have selected to know about a movie\n");
            movieThis(searchFor);
            break;

        case "do-what-it-says":
            console.log("\nYou have selected 'do-what-it-says'\n");
            doWhatItSays();
            break;

        default:
            console.log("\nInvalide user input!\n");

    } //End of switch statement

} //End of liriSearch()


/*************************************************************************************************
 * Function: concertThis()
 * This function calls Bands In Town API with artist name taken as user input and creating query
 *************************************************************************************************/

async function concertThis(searchFor) {

    //console.log("Inside concertThis()");

    //Store artist name taken from file
    let artistName = searchFor;

    //If 'artistName' is null then prompt user for artist name
    if (artistName === "") {
        // Prompt to get artist name from user input
        const artistResp = await getArtistNameToSearchConcerts();

        //Extract artist name from user input
        artistName = artistResp.artist;
    }


    let queryUrl = `https://rest.bandsintown.com/artists/${artistName}/events?app_id="6e95880a-cca7-4c54-957a-290bd8f52183"`;
    // console.log("queryUrl: " + queryUrl);

    // Run a request with axios to the "Bands In Town" API with the specified artist name
    axios
        .get(queryUrl)
        .then(function (eventResp) {

            console.log("\n-------------------------------------------------------\n");

            //If there are no events 
            if (eventResp.data.length === 0) {
                console.log(`No events found for ${artistName} to be held in US soon.`);
                return;
            }

            console.log(`Below are the details of ${artistName}'s events to be held in US:`);

            //Loop through the event objects to display the required fields
            for (let eventNo = 0; eventNo < eventResp.data.length; eventNo++) {

                //Show events that are only in United States
                if (eventResp.data[eventNo].venue.country !== "United States") {
                    continue; //Moveon to the next event
                }

                //By default show only top 10 results from the response
                if (eventNo >= 10)
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
            //Call restartApp() to restart the app if user wishes to
            restartApp();
        })
        .catch(function (err) {
            console.log(err);
        });

} //End of concertThis()


//Function that get artist name from user ---------------------------
function getArtistNameToSearchConcerts() {

    return inquirer.prompt({
        type: "input",
        message: "Enter artist name you want to search?",
        name: "artist",
        default: "Ariana Grande"
    });

} //End of getArtistNameToSearchConcerts()

/*************************************************************************************************
 * Function: spotifyThisSong()
 * This function calls Spotify API with artist name taken as user input and creating query
 *************************************************************************************************/
async function spotifyThisSong(searchFor) {

    // console.log("Inside spotifyThisSong()");

    //Store artist name taken from file
    let artist = searchFor;

    //If 'artist' is null then prompt user for artist/song name
    if (artist === "") {

        // Prompt to get artist name from user input
        const artistOrBandNameResp = await getArtistName();

        //Extract artist/band name from user input
        artist = artistOrBandNameResp.artistOrBandName;
    }

    //Spotify API call
    spotify
        .search({
            type: 'track',
            query: artist,
            limit: 10
        })
        .then(function (response) {

            // console.log("response.tracks.items.length: " + response.tracks.items.length);

            console.log("\n-------------------------------------------------------");

            for (let trackCount = 0; trackCount < response.tracks.items.length; trackCount++) {

                console.log("\n");

                //Show Artist(s)
                let getArtists = response.tracks.items[trackCount].artists;
                let artistsName = [];
                for (let j = 0; j < getArtists.length; j++) {
                    artistsName += getArtists[j].name + "  ";
                }
                console.log("Artist/s: " + artistsName);

                // The song's name
                console.log("Song's name: " + response.tracks.items[trackCount].name);

                // A preview link of the song from Spotify
                console.log("Preview URL: " + response.tracks.items[trackCount].preview_url);

                // The album that the song is from
                console.log("Album name: " + response.tracks.items[trackCount].album.name);

            }

            //Call restartApp() to restart the app if user wishes to
            restartApp();
        })
        .catch(function (err) {
            console.log(err);
        });

} //End of spotifyThisSong()


//Function that get artist name from user ---------------------------
function getArtistName() {

    return inquirer.prompt({
        type: "input",
        message: "Enter artist/band name you want to search?",
        name: "artistOrBandName",
        default: "The Sign, Ace of Base"
    });

} //End of getArtistName()




/*************************************************************************************************
 * Function: movieThis()
 * This function calls OMDB API with movie name taken as user input and creating query
 *************************************************************************************************/
async function movieThis(searchFor) {

    // console.log("Inside movieThis()");

    //Store movie name taken from file
    let movie = searchFor;

    //If 'movie' is null then prompt user for movie name
    if (movie === "") {

        // Prompt to get artist name from user input
        const movieResponse = await getMovieName();

        //Get movie name from user response
        movie = movieResponse.movie;
    }

    let queryUrl = `http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy`;
    // console.log("queryUrl: " + queryUrl);

    // Then run a request with axios to the OMDB API with the movie specified
    axios
        .get(queryUrl)
        .then(function (response) {

            console.log("\n-------------------------------------------------------\n");

            //Check if omdb server response is null
            if (response.data === "") {
                console.log("Movie not found !!");
                return;
            }

            console.log(`Title of the movie: ${response.data.Title}`);
            console.log(`Year the movie came out: ${response.data.Year}`);
            console.log(`IMDB Rating of the movie: ${response.data.imdbRating}`);
            console.log(`Rotten Tomatoes Rating of the movie: ${response.data.Ratings[1].Value}`);
            console.log(`Country where the movie was produced: ${response.data.Country}`);
            console.log(`Language of the movie: ${response.data.Language}`);
            console.log(`Plot of the movie: ${response.data.Plot}`);
            console.log(`Actors in the movie: ${response.data.Actors}`);

            //Call restartApp() to restart the app if user wishes to
            restartApp();
        })
        .catch(function (err) {
            console.log(err);
        });

} //End of movieThis()

//Function that get movie name from user ---------------------------
function getMovieName() {

    return inquirer.prompt({
        type: "input",
        message: "Enter movie you want to search?",
        name: "movie",
        default: "Mr. Nobody"
    });

} //End of getMovieName()

/*************************************************************************************************
 * Function: doWhatItSays()
 * This operation when selected will read 'random.txt' file. Based on the 1st part it will select the specific operation to be performed and take the next part as input parameter 
 *************************************************************************************************/
function doWhatItSays() {

    // console.log("Inside doWhatItSays()");

    // fs is a core Node package for reading and writing files
    let fs = require("fs");

    //Read file
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        //Print contents of file
        // console.log(data);

        // Then split it by commas (to seperate operation and search value)
        var fileData = data.split(",");

        // We will then re-display the content as an array for later use.
        // console.log(fileData);
        
        let option = fileData[0].trim();
        let searchFor = fileData[1].trim();
        searchFor = searchFor.replace(/"/g,""); //Remove double quotes from the string

        //Call function that executes the respective operation
        liriSearch(option, searchFor);

    });

} //End of doWhatItSays()


/*************************************************************************************************
 * Function: restartApp()
 * This function is called to confirm from user whether he/she wants to run the app again 
 *************************************************************************************************/
function restartApp() {

    console.log("\n-------------------------------------------------------\n");

    //Use inquirer to ask user if user would like to run the app again
    inquirer
        .prompt([{
            name: 'runAgain',
            type: 'confirm',
            message: 'Do you want to run the app again?',
            default: false
        }])
        .then(function (userReponse) {

            if (userReponse.runAgain) {

                //If yes, then call startApp function recursively, until user selects "No"
                startApp();
            } else {
                // exit the app
                process.exit(0);
            }
        })
        .catch(function (err) {
            console.log(err);
        });

} //End of restartApp()


/* *************************************************************************** */

//Start the application for the 1st time
console.log("\n ********** Welcome to the Liri App ********** \n");
startApp();