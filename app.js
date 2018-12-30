const express = require('express')
const app = express()
const port = 3000
const strava = require('strava-v3');
var _ = require('lodash');

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

function filterWattworks(item){
	return item.name.indexOf("Technogym")>-1;	
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

	res.send(training_dates); 
	//res.render('index', {results: wattworks_activities, dates: training_dates}); 
	//res.render('index', {blaat: 'blaatjes'}); 

});


// request with the code
app.get('/', (req, res) => {

	// go to index
	//res.render('index', {blaat: 'blaatjes'}); 

	
	strava.athlete.listActivities({},function(err,payload,limits) {
	    //do something with your payload, track rate limits
	    let activities = payload;

	    let wattworks_activities = _.filter(activities, filterWattworks);

		let arr_average_watts  = _.map(wattworks_activities, 'average_watts'); // [12, 14, 16, 18]
		arr_average_watts = _.map(arr_average_watts, round);
		//console.log('arr_average_watts', arr_average_watts); 

	    res.send(arr_average_watts);
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

