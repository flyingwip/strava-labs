const express = require('express')
const app = express()
const port = 3000
const strava = require('strava-v3');
var engines = require('consolidate');
app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');


// payin with the config
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

	// go to index
	res.render('index', {blaat: 'blaat'}); 

	//strava.athlete.listActivities({id:11835180, per_page:10, gear_id:"b5377602"},function(err,payload,limits) {
	// strava.athlete.listActivities({id:11835180, gear_id:"b5377602"},function(err,payload,limits) {
	//     //do something with your payload, track rate limits
	//     res.send(payload);
	// });		

})

// strava.athletes.get({id:11835180},function(err,payload,limits) {
//     //do something with your payload, track rate limits
//     console.log(payload);
// });



//strava.oauth.getToken(code,function(err,payload,limits) {

// now get activities
// strava.athlete.listActivities({id:11835180},function(err,payload,limits) {
//     //do something with your payload, track rate limits
//     res.send(payload);
// });		

//res.send(payload);
//});




app.listen(port, () => console.log(`Example app listening on port ${port}!`))

