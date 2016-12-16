var Twitter = require("twitter");
var twitterKeys = require("./keys.js");
var myKeys = twitterKeys.twitterKeys;
var myTwitter = new Twitter({
  consumer_key: myKeys.consumer_key,
  consumer_secret: myKeys.consumer_secret,
  access_token_key: myKeys.access_token_key,
  access_token_secret: myKeys.access_token_secret
});

var spotify = require("spotify");

var request = require("request");

var fs = require("fs");
	
var command = process.argv[2];

inputArray = [];

for (var i = 3; i < process.argv.length; i++) {
	inputArray.push(process.argv[i]);
}

var input = inputArray.join("+");

function myTweets() {
	myTwitter.get('statuses/user_timeline', {screen_name: 'tyleryonke', count: 20}, function(error, tweets, response) {
		if (error) {
			console.log(error)
		}
		else {
	   		for (var i = 0; i < tweets.length; i++) {
	   			console.log("------------------------------")
	   			console.log("Tweet: " + tweets[i].text);
	   			console.log("Posted: " + tweets[i].created_at)
	   		}
   		}
	});
}

function spotifyThisSong(input) {
	if (input==undefined) {
			console.log("Artist: Ace of Bass");
			console.log("Song: The Sign");
			console.log("Preview URL: https://p.scdn.co/mp3-preview/177e65fc2b8babeaf9266c0ad2a1cb1e18730ae4?cid=null");
			console.log("Album: The Sign (US Album) [Remastered]");
	}
	else {
		spotify.search({type: 'track', query: input}, function(error, data) {
    		
			if (error) {
	       		console.log('Error occurred: ' + err);
	       		return;
	   		}
	   		else {
	   			console.log("Artist: " + data.tracks.items[0].artists[0].name);
	   			console.log("Song: " + data.tracks.items[0].name);
	   			console.log("Preview URL: " + data.tracks.items[0].preview_url);
	   			console.log("Album: " + data.tracks.items[0].album.name);
	   		}
		})
	}
}

function movieThis(input) {
	if (input==undefined) {
	    input = "Mr.+Nobody";
	}

	var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&tomatoes=true&r=json";

	request(queryUrl, function(error, response, body) {

	    if (!error && response.statusCode === 200) {
			console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMBD Rating: " + JSON.parse(body).imdbRating);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
		    console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
	    }
	});
}

switch (command) {
	case "my-tweets":
		console.log("Retrieving Tyler's latest tweets...");

		myTweets();
	break;

	case "spotify-this-song":
		console.log("Looking up your song...");

		spotifyThisSong(input);
	break;

	case "movie-this":
		console.log("Looking up your movie...");
		
		movieThis(input);
	break;

	case "do-what-it-says":
		console.log("Doing as the Random file commands...");

		fs.readFile("random.txt", "utf8", function(error, data) {
			if (error) {
	        	console.log('Error occurred: ' + error);
	        	return;
	    	}
	    	else if (data.indexOf('my-tweets') > -1){
   				myTweets();
  			}
	    	else if (data.indexOf('spotify-this-song') > -1){
   				var responseString = JSON.stringify(data);
	    		var prompt = responseString.replace("spotify-this-song", "");
   				spotifyThisSong(prompt);
  			}
  			else if (data.indexOf('movie-this') > -1){
   				var responseString = JSON.stringify(data);
	    		var prompt = responseString.replace("movie-this", "");
   				movieThis(prompt);
  			}
  			else {
  				console.log("Looks like there's nothing good in the Random file :(")
  			}
		});
	break;
}