// Load all of the plugin dependencies
steal(	
	'can',
	'app/models/events.js',
	function(can, Events) {
		return can.Control({
		}, {
			init: function () {
				console.log("Events list controller initialized!");

				Events.latest({},
							  function(data) {
								  console.log(data);
							  },
							  function(err) {
								  console.log("Error HTTP status: " + err.status);
							  });
			},
			'{Events} latestFetched': function () {
				console.log("EVENT MODEL TRIGGERED");
			}
		});
	});
