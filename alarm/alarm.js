var Sensor = require('./sensor.js');

function Alarm() 
{
	var sensors = [];
	var eventSubscriptions = {};
	var eventSubscriptionsOnce = {};

	var fire = function (eventName, sensor)
	{
		var subscribers = eventSubscriptions[eventName];
		if (typeof subscribers !== 'undefined') {
			for (var i in subscribers) {
				var callback = subscribers[i];
				callback(sensor);
			}
		}

		var subscribersOnce = eventSubscriptionsOnce[eventName];
		if (typeof subscribersOnce !== 'undefined') {
			for (var i in subscribersOnce) {
				var callback = subscribersOnce[i];
				callback(sensor);
			}

			eventSubscriptionsOnce[eventName] = [];
		}
    };


	this.addSensor = function(properties) 
	{
		var sensor = new Sensor();

		sensor.pin(properties.pin);
		sensor.name(properties.name);


		sensors.push(sensor);

		sensor.on('toggle', function(sensor) {
			fire('toggle', sensor);
		});
	}

	this.addSensors = function(sensorPropertiesArray)
	{
		for (var i in sensorPropertiesArray) {
			var sensorProperties = sensorPropertiesArray[i];
			this.addSensor(sensorProperties);
		}
	}

	this.removeSensor = function(identifier) 
	{

	}

	this.find = function(identifier) 
	{

	}

	this.sensors = function()
	{
		return sensors;
	}

	this.listSensors = function(callback )
	{
		for (var i in sensors) {
			var sensor = sensors[i];
			callback(sensor);
		}
	}

	this.on = function (eventName, callback)
	{
		var subscribers = eventSubscriptions[eventName];

		if (typeof subscribers === 'undefined') {
			subscribers = eventSubscriptions[eventName] = [];
		}

		subscribers.push(callback);
    };

    this.once = function (eventName, callback)
	{
		var subscribers = eventSubscriptionsOnce[eventName];

		if (typeof subscribers === 'undefined') {
			subscribers = eventSubscriptionsOnce[eventName] = [];
		}

		subscribers.push(callback);
    };

    this.onToggle = function(callback)
    {
    	this.on('toggle', callback);
    }
}

Alarm.prototype.publicObject = function() 
{
	var result = [];
	var sensors = this.sensors();
	for (var i in sensors) {
		var sensor = sensors[i];
		result.push(sensor.publicObject());
	}

	return result;
}

module.exports = Alarm;