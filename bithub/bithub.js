// Load all of the plugin dependencies
steal(
	'can',
	'bithub/events',
	'bithub/leaderboard',
	'bithub/filterbar',
	'bithub/login',
	'bithub/newpost',
	'bithub/models/tag.js',
	'bithub/models/current_user.js',
	'bithub/assets/styles/bootstrap.css',
	'bithub/assets/styles/app.css',
	function(can, Events, Leaderboard, Filterbar, Login, Newpost, Tag, currentUser){
		var self = this;
		
		$.ajaxPrefilter( function( opts ) {
			//opts.url = opts.url.replace(/^\/api\/(.*)/, "http://api.bithub.com/api/$1");
		});
		
		// Create the state that will be shared by everything
		var currentState = new can.Observe({
			view: 'latest',
			project: '',
			category: ''
		});

		var newpostVisibility = can.compute(false);
		
		var projects = new can.Model.List();
		var categories = new can.Model.List();
		
		Tag.findAll({type: 'category'}, function (data) {
			categories.replace(data);
		});
		
		Tag.findAll({type: 'project'}, function (data) {
			projects.replace(data);
		});

		// Init Controllers
		new Login('#login', {
			currentUser: currentUser,
			newpostVisibility: newpostVisibility
		});
		new Events('#events', { currentState: currentState });
		new Leaderboard('#leaderboard', { currentUser: currentUser });
		new Filterbar('#filterbar', {
			currentState: currentState,
			projects: projects,
			categories: categories
		});
		new Newpost('#newpost-form-container', {
			currentUser: currentUser,
			projects: projects,
			categories: categories,
			visibility: newpostVisibility
		});


	});
