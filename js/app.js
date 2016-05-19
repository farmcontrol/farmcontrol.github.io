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
	var outTemperature = 0;
	var outHumidity = 0;
	var $htmlObject = null;

	// cria a tabela de informações internas
	createInfoTable($('.internal .infosTable'));

	// cria a tabela de informações externas
	createInfoTable($('.external .infosTable'));

	for (var i = Feeds.length - 1; i >= 0; i--) {
		inTemperature = Feeds[i].field3;
		inHumidity = Feeds[i].field4;
		outTemperature = Feeds[i].field1;
		outHumidity = Feeds[i].field2;

		if (i == Feeds.length - 1) {
			// INTERNAL TEMPERATURE INFOS
			$htmlObject = $('.internal').find('.temperature');
			$htmlObject.attr('class', 'temperature ' + getTemperatureColorClass(inTemperature));
			$htmlObject.html(inTemperature + 'C');
			$htmlObject = $('.internal').find('.humidity');
			$htmlObject.attr('class', 'humidity ' + getHumidityColorClass(inHumidity));
			$htmlObject.html( (!!inHumidity) ? 'umidade: ' + inHumidity + '%' : '---');

			// EXTERNAL TEMPERATURE INFOS
			$htmlObject = $('.external').find('.temperature');
			$htmlObject.attr('class', 'temperature ' + getTemperatureColorClass(outTemperature));
			$htmlObject.html(outTemperature + 'C');
			$htmlObject = $('.external').find('.humidity');
			$htmlObject.attr('class', 'humidity ' + getHumidityColorClass(outHumidity));
			$htmlObject.html( (!!outHumidity) ? 'umidade: ' + outHumidity + '%' : '---');

			setLastUpdate(new Date(Feeds[i].created_at));
		} else{
			// prrenche table de informações internas
			$htmlObject = $('.internal .infosTable');
			addLine($htmlObject, inTemperature, inHumidity);

			// prrenche table de informações externas
			$htmlObject = $('.external .infosTable');
			addLine($htmlObject, outTemperature, outHumidity);
		};
	};
}

function createInfoTable($htmlElement){
	$htmlElement.find('.table').remove();
	$htmlElement.html('<table class="table" width="100%" align="center" cellspacing="0" cellpadding="0">');
	$htmlElement.find('.table').append('<tr><th>Temperatura</th><th>Umidade</th></tr>')
}

function addLine($htmlElement, temperature, humidity){
	$htmlElement.find('.table').append('<tr><td class="' + getTemperatureColorClass(temperature) + '">' + temperature + 'C</td><td class="' + getHumidityColorClass(humidity) + '">' + humidity + '%</td></tr>');
}

function setLastUpdate(date){
	var str_data = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
	var str_hora = date.getHours() + 'h' + date.getMinutes();
	$('.dateTime').html('Atualizado em ' + str_data + ' ' + str_hora);
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

$('.btnRefresh').on('click', function(){
	getData(refreshView);
});