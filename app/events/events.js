// Load all of the plugin dependencies
steal(	
	'can',	
	'app/models/events.js',
	'can/view/mustache',
	function(can, Events) {
		return can.Control({
		}, {
			init: function () {
				var self = this;
				
				Events.latest({},
							  function(data) {
								  self.element.html( can.view('events/latest.mustache', {days: data}) );
							  },
							  function(err) {
								  console.log("Error HTTP status: " + err.status);
							  });
			}
			
		});
	});
