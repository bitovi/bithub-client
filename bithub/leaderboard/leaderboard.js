// Load all of the plugin dependencies
steal(	
	'can',
	'bithub/models/users.js',
	function(can, Users) {
		return can.Control({
		}, {
			init: function () {
				Users.leaderboard({},
							  function(data) {
								  //console.log(data);
							  },
							  function(err) {
								  console.log("Error HTTP status: " + err.status);
							  });
			}
		});
	});
