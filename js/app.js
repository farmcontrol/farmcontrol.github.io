var CHANEL_FEED = 'https://api.thingspeak.com/channels/116324/feeds.json?results=4';
var Channel = {};
var Feeds = [];
var internal = $('.internal');
var external = $('.external');
var minTemperature = 10;
var maxTemperature = 25;
var minHumidity = 70;
var maxHumidity = 90;
var $loader = $('.loader');

function getData(callbackFunction){
	showLoader();
	$.getJSON(CHANEL_FEED, function(data){
		Channel = data.channel;
		Feeds = data.feeds;
		hideLoader();
		if(!!callbackFunction) callbackFunction();
	});
}

function showLoader(){
	$loader.show();
}

function hideLoader(){
	$loader.hide();
}

function refreshView(){
	var inTemperature = 0;
	var inHumidity = 0;
	var $htmlObject = null;
	for (var i = Feeds.length - 1; i >= 0; i--) {
		inTemperature = Feeds[i].field1;
		inHumidity = Feeds[i].field2;

		if (i == Feeds.length - 1) {
			// INTERNAL INFOS
			$htmlObject = $('.internal').find('.temperature');
			$htmlObject.attr('class', 'temperature ' + getTemperatureColorClass(inTemperature));
			$htmlObject.html(inTemperature + 'C');

			$htmlObject = $('.internal').find('.humidity');
			$htmlObject.attr('class', 'humidity ' + getHumidityColorClass(inHumidity));
			$htmlObject.html( (!!inHumidity) ? inHumidity + '%' : '---');

			setLastUpdate(new Date(Feeds[i].created_at));
		} else{

		};
	};
}

function setLastUpdate(date){
	var str_data = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
	var str_hora = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

	console.log(str_data);
	console.log(str_hora);
}

function getTemperatureColorClass(temperature){
	if (temperature < minTemperature || temperature > maxTemperature) {
		return 'red';
	} else{
		return 'green';
	}
}

function getHumidityColorClass (humidity){
	if(!!humidity){
		if (humidity < minHumidity || humidity > maxHumidity) {
			return 'red';
		} else{
			return 'green';
		}		
	} else{
		return '';
	}
}

function initialize(){
	hideLoader();
	getData(refreshView);	
}

initialize();