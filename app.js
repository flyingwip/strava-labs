const express = require('express')
const app = express()

const port = 3000
const strava = require('strava-v3');
var _ = require('lodash');
var step = require('everpolate').step

var engines = require('consolidate');
app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');


//-------------- helper functions 

function round(item) {
  return Math.round(item);
}

function belowLimit(item){
	return item < 200;
}

function aboveLimit(item){
	return item >= 200;
}

// function filterWattworks(item){
// 	return item.name.indexOf("Technogym")>-1;	
// }

function filterWattworks(filter){
	return function doFilter(item){
		return item.name.indexOf(filter)>-1;	
	}	
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

  	return day + ' ' + monthNames[monthIndex] + ' ' + year ;
  	//return dateString;

}

function formatToUnixTimestamp(dateString){

	let date = new Date(dateString);

  	return Math.round((date).getTime() / 1000);

}  



// --------------------------------------


// playing with the config
app.get('/config', (req, res) => {

	res.send(strava);

});

app.get('/test', (req, res) => {

	res.send('test die sizzle!');

});


// login
app.get('/login', (req, res) => {

	// make the call to get the redirect url
	const url = strava.oauth.getRequestAccessURL({scope:"view_private,write"}) ;
	res.redirect(url)

});


app.get('/chart', (req, res) => {

	// make the call to get the redirect url
	let wattworks_activities = [207,210,203,167,188,209,198,119,215,204,210,181,205,176,177,205,203,198,139,202,213,190,199,201,220];
	
	let training_dates  = _.map(_.map(wattworks_activities, 'start_date'), formatToDutchDate);	

	//res.send(training_dates); 
	//res.render('index', {results: wattworks_activities, dates: training_dates}); 
	//res.render('index', {blaat: 'blaatjes'}); 

});


// request with the code
app.get('/', (req, res) => {

	// go to index
	
	strava.athlete.listActivities({per_page:90},function(err,payload,limits) {
	    //do something with your payload, track rate limits
	    let activities = payload.reverse();

	    let wattworks_activities = _.filter(activities, filterWattworks('Technogym'));
	    let speedworks_activities = _.filter(wattworks_activities, filterWattworks('SpeedWorks'));
	    let climbworks_activities = _.filter(wattworks_activities, filterWattworks('ClimbWorks'));
	    let blockworks_activities = _.filter(wattworks_activities, filterWattworks('BlockWorks'));
	    let powerworks_activities = _.filter(wattworks_activities, filterWattworks('PowerWorks'));


		let arr_average_watts  = _.map(wattworks_activities, 'average_watts'); 
		arr_average_watts = _.map(arr_average_watts, round);
		
		let training_dates  = _.map(_.map(wattworks_activities, 'start_date'), formatToDutchDate);	

		let average = Math.round(_.meanBy(wattworks_activities, (p) => p.average_watts));
		let average_sp_works = Math.round(_.meanBy(speedworks_activities, (p) => p.average_watts));
		let average_cl_works = Math.round(_.meanBy(climbworks_activities, (p) => p.average_watts));
		let average_bl_works = Math.round(_.meanBy(blockworks_activities, (p) => p.average_watts));
		let average_pw_works = Math.round(_.meanBy(powerworks_activities, (p) => p.average_watts));

		//let max = Math.max(arr_average_watts);
		let max = Math.max.apply(Math, arr_average_watts);
		let min = Math.min.apply(Math, arr_average_watts);

		// 
		let below_limit = _.filter(arr_average_watts, belowLimit).length;
		let above_limit = _.filter(arr_average_watts, aboveLimit).length;

		let unix_training_dates  = _.map(_.map(wattworks_activities, 'start_date'), formatToUnixTimestamp);

		// step(x {Array|Number}, X {Array}, Y {Array}) → {Array}
		let next = step(1, unix_training_dates, arr_average_watts);

		let body_weight = 70;
		let pw_body_weight = Math.round(average/body_weight);

		//console.log('arr_average_watts', arr_average_watts);
		res.render('index', {results: arr_average_watts,
			amount_training_sessions : wattworks_activities.length, 
			dates: training_dates,
			average:average,
			max : max,
			min : min,
			below_limit: below_limit,
			above_limit, above_limit,
			next : next,
			average_sp_works: average_sp_works,
			average_pw_works: average_pw_works,
			average_bl_works : average_bl_works,
			average_cl_works : average_cl_works,
			pw_body_weight : pw_body_weight
		});  

	    //res.send(training_dates.toString());
	});		

})


// request with the code
app.get('/average', (req, res) => {

	// get last 30 activities and calculate averege
	
	//strava.athlete.listActivities({id:11835180, per_page:10, gear_id:"b5377602"},function(err,payload,limits
	strava.athlete.listActivities({id:11835180},function(err,payload,limits) {
	    //do something with your payload, track rate limits
	    res.send(payload);
	});		

})

//

//request gears
app.get('/zones', (req, res) => {

	strava.athlete.listZones({id:11835180},function(err,payload,limits) {
	    //do something with your payload, track rate limits
	    res.send(payload);
	});		
	
})




app.listen(port, () => console.log(`Example app listening on port ${port}!`))

