jQuery(document).ready(function($) {
	var socket = io.connect();
	

	socket.on('sensors', function (sensors) {
		$('body').html();
		for (var i in sensors) {
			var sensor = sensors[i];
			var name = $('<div/>').addClass('name').html(sensor.name);
			var updated = $('<abbr/>').addClass('updated').livestamp(sensor.updated / 1000);

			var sensorDiv = $('<div/>').addClass('sensor sensor-'+sensor.name.toLowerCase());
			sensorDiv.css('height', 100/sensors.length + '%');
			sensorDiv.append(name);
			sensorDiv.append(updated);
			sensorDiv.appendTo('body');
		}
	});


	socket.on('sensor', function (sensor) {
		console.log(sensor);
		var sensorDiv = $('.sensor-'+sensor.name.toLowerCase());
		if (sensor.state) {
			sensorDiv.addClass('active');
			sensorDiv.find('.updated').livestamp('destroy').html('now');
		} else {
			sensorDiv.removeClass('active');
			sensorDiv.find('.updated').livestamp(sensor.updated / 1000);
		}

	
	});	
});


