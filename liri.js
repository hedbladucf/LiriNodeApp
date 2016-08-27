/* IMPORT ALL REQUIRED NPM */
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var twitterKeys = require('./keys.js').twitterKeys;

/* INPUT VARIABLES */
var action = process.argv[2];

/* SWITCH TO CONTROL ACTION INPUT */
switch(action){

	case 'my-tweets':
		myTweets();
		break;

	case 'spotify-this-song':
		// If 4th argument is undefined, assign default song name
		if(process.argv[3] == undefined){
			process.argv[3] = 'Holocene';
		};
		spotifyThis(process.argv[3]);
		break;

	case 'movie-this':
		// If 4th argument is undefined, assign default movie
		if(process.argv[3] == undefined){
			process.argv[3] = 'Inception';
		};
		movieThis(process.argv[3]);
		break;

	case 'do-what-it-says':
		doWhat();
		break;

	default:
		console.log("Invalid entry!");
		break;
}

/* TWITTER FUNCTION: 
	Returns latest tweets (<= 20) from my twitter handle (@SwedishCheef),
	then logs the twitter action. 
*/
function myTweets()
{
	var twitterClient = new Twitter({
		consumer_key: twitterKeys.consumer_key,
		consumer_secret: twitterKeys.consumer_secret,
		access_token_key: twitterKeys.access_token_key,
		access_token_secret: twitterKeys.access_token_secret
	});

	var twitterParameter = {
		screen_name: 'swedishcheef'
	};

	twitterClient.get('statuses/user_timeline', twitterParameter, function(error, tweets, response){

		if(!error)
		{
			var endOfTweets;
			if(tweets.length > 20){
				endOfTweets = 20;
			}else{
				endOfTweets = tweets.length;
			}
			for(var i = 0; i < endOfTweets; i++)
			{
				var tweet = tweets[i];
				console.log(tweet.created_at + ': ' + tweet.text);
			}
		}
	});
	log('my-tweets');
}

/* SPOTIFY FUNCTION: 
	Prints artist, name of song, preview url, and the artist's album,
	then logs the apotify action. 
*/
function spotifyThis(passedTrack)
{
	spotify.search({type: 'track', query: passedTrack}, function(error, data){
		
		if(error) 
		{
			console.log("Error: " + error);
			return;
		}
		if(data.tracks.items.length == 0)
		{
			spotify.search({type: 'track', query: 'Wish You Were Here'}, function(error2, data2){

				var spotifyData = data2.tracks.items[0];
				var artist = spotifyData.artists[0].name;
				var nameOfSong = spotifyData.name;
				var previewUrl = spotifyData.preview_url;
				var album = spotifyData.album.name;

				console.log("----------------------------");
				console.log("ARTIST: " + artist);
				console.log("NAME OF SONG: " + nameOfSong);
				console.log("PREVIEW URL: " + previewUrl);
				console.log("ALBUM: " + album);
				console.log("-----------------------------");

			});
			return;
		}

		var spotifyData = data.tracks.items[0];
		var artist = spotifyData.artists[0].name;
		var nameOfSong = spotifyData.name;
		var previewUrl = spotifyData.preview_url;
		var album = spotifyData.album.name;

		console.log("----------------------------");
		console.log("ARTIST: " + artist);
		console.log("NAME OF SONG: " + nameOfSong);
		console.log("PREVIEW URL: " + previewUrl);
		console.log("ALBUM: " + album);
		console.log("-----------------------------");
	});
	log('spotify-this-song');
}

/* SPOTIFY FUNCTION: 
	Prints title, year, country, plot, imdb/tomatoes rating, and actors, based on user input,
	then logs the movie-this action. 
*/
function movieThis(movie) {

  request('http://www.omdbapi.com/?t=' + movie + 
    '&y=&plot=short&tomatoes=true&r=json', function (error, response, body) {

      if (!error && response.statusCode == 200) {

        var data = JSON.parse(body);

        console.log("--------------------------------------");
        console.log("TITLE: " + data.Title);
        console.log("YEAR: " + data.Year);
        console.log("COUNTRIES RELEASED: " + data.Country);
        console.log("LANGUAGES: " + data.Language);
        console.log("PLOT: " + data.Plot);
        console.log("ACTORS: " + data.Actors);
        console.log("IMDB RATING: " + data.imdbRating);
        console.log("TOMATOES RATING: " + data.tomatoRating);
        console.log("--------------------------------------");

      } else {
        console.log("### There was an error in looking up this movie.");
      }
    });

  log("movie-this");

}

/* RANDOM COMMAND FUNCTION */
function doWhat()
{
	// Reads from 'random.txt' 
	fs.readFile('random.txt', 'utf8', function(error, data){

		// Splits data based on ','
		var dataArray = data.split(',');

		// First data argument
		switch(dataArray[0])
		{
			case 'my-tweets':
				myTweets();
				break;

			case 'spotify-this-song':
				// Second data argument
				spotifyThis(dataArray[1]);
				break;

			case 'movie-this':
				// Second data argument
				movieThis(dataArray[1]);
				break;
		}
	});
}

/* LOG FUNCTION */
function log(input)
{
	// Appends action to 'log.txt'
	fs.appendFile('log.txt', input + ', ', function(error){

		if(error){
			console.error(error);
		}
		console.log("Log was updated!");
	});
}