module.exports = function (db, cb) {

    db.define("events", {
		identifier  : String,
		state		: Boolean,
		ts			: {type: 'date', time: true},
	});

	return cb();
};