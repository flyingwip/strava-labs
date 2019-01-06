console.log('hallo');

var fs = require('fs');
var _ = require('lodash');

var helpers = require('./helpers')

function round(item) {
  return Math.round(item);
}

function belowLimit(item){
	return item < 200;
}

function aboveLimit(item){
	return item >= 200;
}

function formatToDutchDate(dateString){

	let date = new Date(dateString);
	var monthNames = [
	    "jan", "feb", "mar",
	    "apr", "mei", "jun", "jul",
	    "aug", "sep", "okt",
	    "nov", "dec"
	  ];

	var day = date.getDate();
  	var monthIndex = date.getMonth();
  	var year = date.getFullYear();

  	return day + ' ' + monthNames[monthIndex] + ' ' + year;

}

function formatToUnixTimestamp(dateString){

	let date = new Date(dateString);

  	return Math.round((date).getTime() / 1000);

}

var activities = JSON.parse(fs.readFileSync('activities_wouter.json', 'utf8'));

//let wattworks_activities = _.filter(activities, { 'gear_id': 'b5377602',});
let wattworks_activities = _.filter(activities, function(item){
	return item.name.indexOf("Technogym")>-1;
});



let average_watts = _.meanBy(wattworks_activities, (p) => p.average_watts);

console.log( 'avg', Math.round(average_watts));

let max = _.maxBy(wattworks_activities, (p) => p.average_watts);
let min = _.minBy(wattworks_activities, (p) => p.average_watts);

console.log('max', max.average_watts);
console.log('min', min.average_watts);

let values  = _.map(wattworks_activities, 'average_watts');
values = _.map(values, Math.round);
console.log('values', values); 

// count all values below 200 

// 
let bad_activities = _.filter(values, belowLimit);
let good_activities = _.filter(values, aboveLimit);
console.log('bad_activities :: ', bad_activities.length); 
console.log('good_activities :: ', good_activities.length); 

console.log('------------------');

// get all start date form filterd array

let training_dates  = _.map(_.map(wattworks_activities, 'start_date'), formatToDutchDate);
//training_dates = _.map(training_dates, formatToDutchDate);	
console.log(training_dates);


console.log('------------------');

let unix_training_dates  = _.map(_.map(wattworks_activities, 'start_date'), formatToUnixTimestamp);
//training_dates = _.map(training_dates, formatToDutchDate);	
console.log(unix_training_dates);


let last = wattworks_activities.slice(Math.max(wattworks_activities.length - 5, 1));

let average_last_works = Math.round(_.meanBy(last, (p) => p.average_watts));
console.log(average_last_works);

//console.log('max', average_watts);

// what is max 

//let weighted_average_watts = _.meanBy(activities, (p) => p.weighted_average_watts);

//console.log(average_watts);


// // filter array by gear_id : b5377602
// //let wattworks_activities = _.filter(activities, { 'gear_id': 'b5377602',});
// //console.log(wattworks_activities.length );

// // filter by 'technogym in name'


// //average_watts = _.meanBy(activities_wouter, (p) => p.average_watts);

// curl -G https://www.strava.com/api/v3/athletes/5003529/activities -H "Authorization: Bearer 7784a38269883f521b0761bc48035b86d481248f"
// curl -G https://www.strava.com/api/v3/athletes/11835180/activities -H "Authorization: Bearer 6ace8809648b3892966506b0e90553809f666ea8"

// //curl -G https://www.strava.com/api/v3/athlete/11835180/gears -H "Authorization: Bearer 6ace8809648b3892966506b0e90553809f666ea8"

// https://www.strava.com/oauth/authorize?client_id=8713&response_type=code&redirect_uri=http://localhost:3000/token_exchange&approval_prompt=force

//curl -G https://www.strava.com/api/v3/athlete \
  //   -H "Authorization: Bearer 39976de57c9f339e8d06fd9a1b59ca11795c4037"

 // curl -X GET "https://www.strava.com/api/v3/athletes/5003529?access_token=39976de57c9f339e8d06fd9a1b59ca11795c4037" -H "accept: application/json"

 // https://www.strava.com/api/v3/athlete 'Authorization: Bearer 39976de57c9f339e8d06fd9a1b59ca11795c4037'

 // https://www.strava.com/oauth/authorize?client_id=8713&response_type=code&redirect_uri=http://localhost:3000/token_exchange&approval_prompt=force


// To get a new access token

curl -d "client_id=8713&secret=041e2e1dff3cd853599a1c03dccbe24aaf694ce3&grant_type=refresh_token&refresh_token=36e5df3414682d7fff6bf8a9943a2312198b5ff8" -X POST https://www.strava.com/oauth/token



