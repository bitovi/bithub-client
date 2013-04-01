// Load all of the plugin dependencies
steal(	
	'can',
	'app/models/tags.js',
	function(can, Tags) {
		return can.Control({
		}, {
			init: function () {
				console.log("Filterbar controller initialized!");

				Tags.findAll({},
							 function(data) {
								 console.log(data);
							 },
							 function(err) {
								 console.log("Error HTTP status: " + err.status);
							 });
			}
		});
	});
