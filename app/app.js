// Load all of the plugin dependencies
steal(
	//'./styles.css',
	'app/events',
	'app/leaderboard',
	'app/filterbar',
	function(Events, Leaderboard, Filterbar){
		
		// Create the state that will be shared by everything
		var currentState = can.compute();

		// Init Controllers
		new Events('#events');
		new Leaderboard('#leaderboard');
		new Filterbar('#filterbar');
		
		// 
		console.log("BitHub client loaded!");
	});


