// Load all of the plugin dependencies
steal(	
	'can',	
	'bithub/models/event.js',
	'can/view/mustache',
	function(can, Event) {
		return can.Control({
		}, {
			init: function () {
				var self = this;
				
				Event.latest({},
							  function(data) {
								  self.element.html( can.view('events/latest.mustache', {days: data}) );
							  },
							  function(err) {
								  console.log("Error HTTP status: " + err.status);
							  });
			}
			
		});
	});
