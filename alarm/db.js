var orm = require("orm");

function DB(connectionString, callback) 
{
	//connect to database
	orm.connect(connectionString, function (err, db) {
		if (err) {
			console.log(err);
		} else {
			// load database models
			db.load("./models", function (err) {

				if (err) {
					console.log(err);
				} else {

					//create model objects
					var event = db.models.events;
					console.log('done');

					//initiate callback with models
					callback({event:event});
				}
   
			});
		}
	});
}

module.exports = DB;
