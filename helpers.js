var _ = require('lodash');


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

exports.round = round
exports.belowLimit = belowLimit
exports.aboveLimit = aboveLimit
exports.filterWattworks = filterWattworks
exports.formatToDutchDate = formatToDutchDate
exports.formatToUnixTimestamp = formatToUnixTimestamp


// --------------------------------------