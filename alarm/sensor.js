var gpio = require("pi-gpio");

var readoutSpeed = 100;
var inverse = false;

var simulationMinTime = 1000;
var simulationMaxTime = 5000;

function Sensor()
{
	// Private properties
	var self = this;
	var readLoop = null;

	var state = false;

	var pin = 0;
	var name = 'unknown';


	var eventSubscriptions = {};
	var eventSubscriptionsOnce = {};

	// Private functions
	var toggle = function(toggleState)
	{
		if (state != toggleState) {
			state = toggleState;
			fire('toggle');
		}
	}

	var fire = function (eventName)
	{
		var subscribers = eventSubscriptions[eventName];
		if (typeof subscribers !== 'undefined') {
			for (var i in subscribers) {
				var callback = subscribers[i];
				callback(self);
			}
		}

		var subscribersOnce = eventSubscriptionsOnce[eventName];
		if (typeof subscribersOnce !== 'undefined') {
			for (var i in subscribersOnce) {
				var callback = subscribersOnce[i];
				callback(self);
			}

			eventSubscriptionsOnce[eventName] = [];
		}
    };


   	var startReadout = function()
   	{
   		clearInterval(readLoop);
   		gpio.open(pin, "input", function(err) {  
   			readLoop = setInterval(function() {
				gpio.read(pin, function(err, value) {
				    if(err) {
				    	console.log(err);
				    }
				    toggle(value != inverse);
				});
			}, readoutSpeed);
   		});
   	}


	// Privileged functions
	this.state = function()
	{

		return state;
	}

	this.pin = function()
	{
		if (arguments.length === 1) {
			pin = arguments[0];
			startReadout();
		} else {
			return pin;
		}
	}

	this.name = function()
	{
		if (arguments.length === 1) {
			name = arguments[0];
		} else {
			return name;
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

	// Simulation tools
	var randomTime = function()
	{

		return (Math.random() * (simulationMaxTime - simulationMinTime)) + simulationMinTime;
	}

	var simulateToggle = function()
	{
		toggle(!state);
		self.startSimulation();
	}

	this.startSimulation = function()
	{

		setTimeout(simulateToggle, randomTime());
	}
};

module.exports = Sensor;