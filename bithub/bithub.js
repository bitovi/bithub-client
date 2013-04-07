// Load all of the plugin dependencies
steal(
	//'./styles.css',
	'can',
	'bithub/events',
	'bithub/leaderboard',
	'bithub/filterbar',
	'bithub/login',
	function(can, Events, Leaderboard, Filterbar, Login){
		// Create the state that will be shared by everything
		var currentState = new can.Observe({
			view: 'latest',
			project: '',
			category: ''
		});

		// Init Controllers
		new Events('#events', {currentState: currentState});
		new Filterbar('#filterbar', {currentState: currentState});
		new Leaderboard('#leaderboard');
		new Login('#login');
	});
