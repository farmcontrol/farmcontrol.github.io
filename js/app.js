var CHANEL_FEED = 'https://api.thingspeak.com/channels/116324/feeds.json?results=4';
var Channel = {};
var Feeds = [];
var internal = $('.internal');
var external = $('.external');

var externalRange = {
	minTemperature: 10,
	maxTemperature: 25,
	minHumidity: 	70,
	maxHumidity: 	90
}
var internalRange = {
	minTemperature: 10,
	maxTemperature: 25,
	minHumidity: 	70,
	maxHumidity: 	90
}

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
			$htmlObject.attr('class', 'temperature ' + getTemperatureColorClass(inTemperature, internalRange));
			$htmlObject.html(inTemperature + 'C');
			$htmlObject = $('.internal').find('.humidity');
			$htmlObject.attr('class', 'humidity ' + getHumidityColorClass(inHumidity, internalRange));
			$htmlObject.html( (!!inHumidity) ? 'umidade: ' + inHumidity + '%' : '---');

			// EXTERNAL TEMPERATURE INFOS
			$htmlObject = $('.external').find('.temperature');
			$htmlObject.attr('class', 'temperature ' + getTemperatureColorClass(outTemperature, externalRange));
			$htmlObject.html(outTemperature + 'C');
			$htmlObject = $('.external').find('.humidity');
			$htmlObject.attr('class', 'humidity ' + getHumidityColorClass(outHumidity, externalRange));
			$htmlObject.html( (!!outHumidity) ? 'umidade: ' + outHumidity + '%' : '---');

			setLastUpdate(new Date(Feeds[i].created_at));
		} else{
			// prrenche table de informações internas
			$htmlObject = $('.internal .infosTable');
			addLine($htmlObject, inTemperature, inHumidity, internalRange);

			// prrenche table de informações externas
			$htmlObject = $('.external .infosTable');
			addLine($htmlObject, outTemperature, outHumidity, externalRange);
		};
	};
}

function createInfoTable($htmlElement){
	$htmlElement.find('.table').remove();
	$htmlElement.html('<table class="table" width="100%" align="center" cellspacing="0" cellpadding="0">');
	$htmlElement.find('.table').append('<tr><th>Temperatura</th><th>Umidade</th></tr>')
}

function addLine($htmlElement, temperature, humidity, location){
	$htmlElement.find('.table').append('<tr><td class="' + getTemperatureColorClass(temperature, location) + '">' + temperature + 'C</td><td class="' + getHumidityColorClass(humidity, location) + '">' + humidity + '%</td></tr>');
}

function setLastUpdate(date){
	var str_data = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
	var str_hora = date.getHours() + 'h' + date.getMinutes();
	$('.dateTime').html('Atualizado em ' + str_data + ' ' + str_hora);
}

function getTemperatureColorClass(temperature, location){
	if (temperature < location.minTemperature || temperature > location.maxTemperature) {
		return 'red';
	} else{
		return 'green';
	}
}

$('#intSettingsButton').on('click', function(){
    $('#modal-main-int').css('display', "block");
});

$('#extSettingsButton').on('click', function(){
    $('#modal-main-ext').css('display', "block");
});


$('.close').on('click', function(){
    $('#modal-main-int').css('display', "none");
    $('#modal-main-ext').css('display', "none");
});

window.onclick = function(event){
	if (event.target == document.getElementById('modal-main-int') || 
		event.target == document.getElementById('modal-main-ext')) {
    	$('#modal-main-int').css('display', "none");
        $('#modal-main-ext').css('display', "none");
    }
};

function getHumidityColorClass (humidity, location){
	if(!!humidity){
		if (humidity < location.minHumidity || humidity > location.maxHumidity) {
			return 'red';
		} else{
			return 'green';
		}		
	} else{
		return '';
	}
}

function setInputText(){
	$('#intMinTemp').val(internalRange.minTemperature);
	$('#intMaxTemp').val(internalRange.maxTemperature);

	$('#intMinHumidity').val(internalRange.minHumidity);
	$('#intMaxHumidity').val(internalRange.maxHumidity);

	$('#extMinTemp').val(externalRange.minTemperature);
	$('#extMaxTemp').val(externalRange.maxTemperature);

	$('#extMinHumidity').val(externalRange.minHumidity);
	$('#extMaxHumidity').val(externalRange.maxHumidity);
};

function initialize(){
	hideLoader();
	getData(refreshView);
	setInputText();
}

 function validateValues(){
 	
 	var isValidated = false;

	var intMinTemp = Number($('#intMinTemp').val()),
		intMaxTemp = Number($('#intMaxTemp').val()),
		extMinTemp = Number($('#extMaxTemp').val()),
		extMaxTemp = Number($('#extMaxTemp').val());

	if (intMinTemp > intMaxTemp || extMinTemp > extMaxTemp){
		$('#errorMsg').text('A temperatura mínima é maior do que a temperatura máxima.');
		return false;
	}else{

		var intMinHumidity = Number($('#intMinHumidity').val()),
			intMaxHumidity = Number($('#intMaxHumidity').val()),
			extMinHumidity = Number($('#extMinHumidity').val()),
			extMaxHumidity = Number($('#extMaxHumidity').val());

		if (intMinHumidity > intMaxHumidity || extMinHumidity > extMaxHumidity){
			$('#errorMsg').text('A umidade mínima é maior do que a temperatura máxima.');
			return false;
		}else{
			isValidated = true;
		}

		if (isValidated == true){
			internalRange.minTemperature = $('#intMinTemp').val();
			internalRange.maxTemperature = $('#intMaxTemp').val();
			externalRange.minTemperature = $('#extMinTemp').val();
			externalRange.maxTemperature = $('#extMaxTemp').val();
			internalRange.minHumidity 	 = $('#intMinHumidity').val();
			internalRange.maxHumidity 	 = $('#intMaxHumidity').val();
			externalRange.minHumidity 	 = $('#extMinHumidity').val();
			externalRange.maxHumidity 	 = $('#extMaxHumidity').val();
			$('#errorMsg').text('');
			return true;
		}
	}
}

$('.btnRefresh').on('click', function(){
	getData(refreshView);
});

function getInput(event){
	
	if (event.which == 190 || event.which == 69){
		event.preventDefault();
		event.stopPropagation();
		return false;
	}

	if (event.which	!= 188 && event.which != 8 && event.which != 46 && event.which != 9){
		if (event.target.value.indexOf('.') == -1){
			return event.target.value.length <= 2;
		}else{
			return event.target.value.split(',')[0].length < 2 && event.target.value.split(',')[1].length == 1;
		}
	}

	if (event.target.validationMessage != ''){
		$('#errorMsg').text(event.target.validationMessage);
	}else{
		for (var i = 0; i < event.target.parentNode.children.length - 1; i++) {
			if (event.target.parentNode.children[i].validationMessage){
				if (event.target.parentNode.children[i].validationMessage != ''){
					$('#errorMsg').text(event.target.validationMessage);
					return false;
				}
			}
		}
		$('#errorMsg').text('');
		return true;
	}
}

$('#setInternal').on('click', function(){
	if (validateValues() && $('#errorMsg').text() == ''){
		$('#modal-main-int').css('display', "none");
		getData(refreshView);
    	setInputText();
    	console.log(internalRange);
	}
});

$('#setExternal').on('click', function(){
	if (validateValues() && $('#errorMsg').text() == ''){
		$('#modal-main-ext').css('display', "none");
		getData(refreshView);
    	setInputText();
    	console.log(externalRange);
	}
});