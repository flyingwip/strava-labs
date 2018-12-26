const express = require('express')
const app = express()
const port = 3000
const strava = require('strava-v3');


// login
app.get('/login', (req, res) => {
	// make the call to get the redirect url
	const url = strava.oauth.getRequestAccessURL({scope:"view_private,write"}) ;
	res.redirect(url)
});


// request with the code
app.get('/', (req, res) => {

	//const code = req.query.code;

	//strava.oauth.getToken(code,function(err,payload,limits) {
	    
		// now get activities
		strava.athlete.listActivities({id:11835180},function(err,payload,limits) {
		    //do something with your payload, track rate limits
		    res.send(payload);
		});		




	    //res.send(payload);
	//});


	//res.send('Hello Strava!' + code);
})

// strava.athletes.get({id:11835180},function(err,payload,limits) {
//     //do something with your payload, track rate limits
//     console.log(payload);
// });






app.listen(port, () => console.log(`Example app listening on port ${port}!`))

