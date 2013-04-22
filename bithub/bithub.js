// Load all of the plugin dependencies
steal(
	'can',
	'bithub/events',
	'bithub/leaderboard',
	'bithub/filterbar',
	'bithub/login',
	'bithub/models/tag.js',
	'bithub/models/current_user.js',
	'vendor/bootstrap/bootstrap.min.css',
	'bithub/assets/styles/app.css',
	function(can, Events, Leaderboard, Filterbar, Login, Tag, currentUser){
		var self = this;
		
		// Create the state that will be shared by everything
		var currentState = new can.Observe({
			view: 'latest',
			project: '',
			category: ''
		});
		
		var projects = new can.Model.List();
		var categories = new can.Model.List();
		
		Tag.findAll({type: 'category'}, function (data) {
			categories.replace(data);
		});
		
		Tag.findAll({type: 'project'}, function (data) {
			projects.replace(data);
		});

		// Init Controllers
		new Login('#login', { currentUser: currentUser });
		new Events('#events', { currentState: currentState });
		new Leaderboard('#leaderboard', { currentUser: currentUser });
		new Filterbar('#filterbar', {
			currentState: currentState,
			projects: projects,
			categories: categories
		});


	});
