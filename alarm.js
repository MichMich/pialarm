var Alarm = require('./alarm/alarm.js');
var alarm = new Alarm();

var sensors = [
	{pin: 12, name: 'Zijkamer'},
	{pin: 16, name: 'Woonkamer'},
	{pin: 18, name: 'Gang'},
	{pin: 22, name: 'Deur'},
	{pin: 15, name: 'Slaapkamer'}
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