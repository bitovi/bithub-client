// Load all of the plugin dependencies
steal(	
	'can',
	'app/models/events.js',
	function(can) {
		return can.Control({
		}, {
			init: function () {
				console.log("Events list controller initialized!");
			}
		});
	});
