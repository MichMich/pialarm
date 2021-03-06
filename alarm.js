// config
var sensors = [
	{pin: 22, name: 'Deur', 		identifier: 'door'},
	{pin: 18, name: 'Gang', 		identifier: 'hallway'},
	{pin: 16, name: 'Woonkamer', 	identifier: 'livingroom'},
	{pin: 15, name: 'Slaapkamer', 	identifier: 'bedroom'},
	{pin: 12, name: 'Zijkamer', 	identifier: 'spareroom'}
];

// load modules
var Alarm = require('./alarm/alarm');

// create instances
var express = require('express');
var app = express();
var io = require('socket.io').listen(app.listen(8080));
var alarm = new Alarm();

// enable public webserver
app.use(express.static(__dirname + '/public'));

// add sensors to alarm
alarm.addSensors(sensors);
alarm.listSensors(function(sensor) {
	console.log('Initialized '+sensor.name()+' on pin '+sensor.pin());
	//sensor.startSimulation();
});

// debugging
alarm.onToggle(function(sensor) {
	console.log(sensor.identifier() + ': ' +sensor.state());
});

// setup websocket broadcasting for webinterface
io.sockets.on('connection', function (socket) {
	socket.emit('sensors', alarm.publicObject());
	alarm.onToggle(function(sensor) {
		socket.emit('sensor', sensor.publicObject());
	});
});
