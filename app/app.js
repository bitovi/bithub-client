// Load all of the plugin dependencies
steal(
	//'./styles.css',
	'can',
	'app/events',
	'app/leaderboard',
	'app/filterbar',
	
	'jquery',
	'ui/bootstrap.js',
	function(can, Events, Leaderboard, Filterbar){
		
		// Create the state that will be shared by everything
		var currentState = can.compute();

		// Init Controllers
		new Events('#events');
		new Leaderboard('#leaderboard');
		new Filterbar('#filterbar');
		
	});


