# liri-node-app

This project gives user an option to select one of the following-
1. concert-this
2. spotify-this-song
3. movie-this
4. do-what-it-says

### concert-this:
* This option hits the "Bands In Town" API to get the details of a particular artist playing live/having a concert in USA. 
* The artist name is taken from user using 'inquirer' prompt.
* Only the top 10 results are displayed to the user.


### spotify-this-song:
* This selection hits the "Spotify" API with the hidden client ID and client secret.
* The artist name is taken from user using 'inquirer' prompt.
* Only the top 10 results are displayed to the user.

### movie-this:
* This selection hits the "OMDB" API using the API key to get details of a particular movie. 
* The movie name is taken from user using 'inquirer' prompt.

### do-what-it-says:
* This option basically reads data from a file using "fs" Node package.
* This file contains the desired operation from the above 3 options (concert-this/spotify-this-song/movie-this) and the search value i.e. artist name/movie name w.r.t. the operation.


At the ecompletion of each operation, the application will ask the user if he/she wants to run the application again using 'inquirer' prompt. If user selects "Yes" then app will ask the user to select above mentioned options again, else the app will exit.



## Technologies used

Built with Node.js and includes use of 3 public APIs- Bands In Town, Spotify and OMDB.

## Screenshots
![alt text](https://github.com/ankitadhyani/liri-node-app/blob/master/snapshots/1_StartApp.png "Start App")

![alt text](https://github.com/ankitadhyani/liri-node-app/blob/master/snapshots/2_Concert.png "Concert")

![alt text](https://github.com/ankitadhyani/liri-node-app/blob/master/snapshots/3_SelectSpotifySearch.png "Select Spotify Search")

![alt text](https://github.com/ankitadhyani/liri-node-app/blob/master/snapshots/4_SpotifyResults.png "Spotify Results")

![alt text](https://github.com/ankitadhyani/liri-node-app/blob/master/snapshots/5_SelectMovieSearch.png "Select Movie Search")

![alt text](https://github.com/ankitadhyani/liri-node-app/blob/master/snapshots/6_ReadFile.png "Read File")

![alt text](https://github.com/ankitadhyani/liri-node-app/blob/master/snapshots/7_ReadFile_SpotifySearch.png "Read File Spotify Search")


