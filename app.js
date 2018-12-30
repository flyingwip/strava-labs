const express = require('express')
const app = express()
const port = 3000
const strava = require('strava-v3');


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


// request with the code
app.get('/', (req, res) => {

	//strava.athlete.listActivities({id:11835180, per_page:10, gear_id:"b5377602"},function(err,payload,limits
	//strava.athlete.listActivities({id:11835180},function(err,payload,limits) {
	strava.athlete.listActivities({},function(err,payload,limits) {
	    //do something with your payload, track rate limits
	    res.send(payload);
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

