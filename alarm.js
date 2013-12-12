var express = require('express');
var app = express();
var io = require('socket.io').listen(app.listen(8080));

app.use(express.static(__dirname + '/public'));

var Alarm = require('./alarm/alarm.js');
var alarm = new Alarm();

var sensors = [
	{pin: 22, name: 'Deur'},
	{pin: 18, name: 'Gang'},
	{pin: 16, name: 'Woonkamer'},
	{pin: 15, name: 'Slaapkamer'},
	{pin: 12, name: 'Zijkamer'}
];

alarm.addSensors(sensors);

alarm.listSensors(function(sensor) {
	console.log('Initialized '+sensor.name()+' on pin '+sensor.pin());
	//sensor.startSimulation();
});

alarm.onToggle(function(sensor) {
	var now = new Date();
	console.log(now.toString()+' - '+sensor.name()+': '+sensor.state());
});

io.sockets.on('connection', function (socket) {
	
	socket.emit('sensors', alarm.publicObject());

	alarm.onToggle(function(sensor) {
		socket.emit('sensor', sensor.publicObject());
	});

});