// Dependencies =========================
var
twit = require('twit'),
config = require('./config');
var Twitter = new twit(config);
// load file and get coin 
var fs  = require("fs");
var coinarray = fs.readFileSync('top1000.txt').toString().split('\n');
var cointxtarray = fs.readFileSync('cointweets.txt').toString().split('\n');

// find latest tweet according the query 'q' in params
var tweet = function() {
    var rndcoin = ranDom(coinarray)
    var siteandcoin = rndcoin.split(",");
    var txtaboutcoin = ranDom(cointxtarray)
    
    var coinname = siteandcoin[1];
    txtaboutcoin = txtaboutcoin.replace(new RegExp('COIN-REPLACE-RGB9291', 'g'), coinname)
    //console.log(txtaboutcoin)
    var status = {
        status: txtaboutcoin
    }

    Twitter.post('statuses/update',status, function(err, data, response) {
        if (err) {
            console.log('Something went wrong while RETWEETING... Duplication maybe...');
            console.log(err)
        }else{
            console.log(status)
        }
    })
}

 tweet();
// tweet in every 1 minutes
 setInterval(tweet, 10*60*1000);
// RETWEET BOT ==========================

// find latest tweet according the query 'q' in params
var retweet = function() {
var params = {
    q: '#nodejs, #Nodejs',  // REQUIRED
    result_type: 'recent',
    lang: 'en'
}
Twitter.get('search/tweets', params, function(err, data) {
  // if there no errors
    if (!err) {
      // grab ID of tweet to retweet
        var retweetId = data.statuses[0].id_str;
        // Tell TWITTER to retweet
        Twitter.post('statuses/retweet/:id', {
            id: retweetId
        }, function(err, response) {
            if (response) {
                console.log('Retweeted!!!');
            }
            // if there was an error while tweeting
            if (err) {
                console.log('Something went wrong while RETWEETING... Duplication maybe...');
            }
        });
    }
    // if unable to Search a tweet
    else {
      console.log('Something went wrong while SEARCHING...');
    }
});
}

// grab & retweet as soon as program is running...
// retweet();
// retweet in every 50 minutes
// setInterval(retweet, 3000000);

// FAVORITE BOT====================

// find a random tweet and 'favorite' it
var favoriteTweet = function(){
var params = {
  q: '#nodejs, #Nodejs',  // REQUIRED
  result_type: 'recent',
  lang: 'en'
}
// find the tweet
Twitter.get('search/tweets', params, function(err,data){

// find tweets
var tweet = data.statuses;
var randomTweet = ranDom(tweet);   // pick a random tweet

// if random tweet exists
if(typeof randomTweet != 'undefined'){
  // Tell TWITTER to 'favorite'
  Twitter.post('favorites/create', {id: randomTweet.id_str}, function(err, response){
    // if there was an error while 'favorite'
    if(err){
      console.log('CANNOT BE FAVORITE... Error');
    }
    else{
      console.log('FAVORITED... Success!!!');
    }
  });
}
});
}
// grab & 'favorite' as soon as program is running...
// favoriteTweet();
// 'favorite' a tweet in every 60 minutes
// setInterval(favoriteTweet, 3600000);

// function to generate a random tweet tweet
function ranDom (arr) {
var index = Math.floor(Math.random()*arr.length);
return arr[index];
};