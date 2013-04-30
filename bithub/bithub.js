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
	'ui/onbottom.js',
	'bithub/assets/styles/bootstrap.css',
	'bithub/assets/styles/app.css',
	function(can, Events, Leaderboard, Filterbar, Login, Newpost, Tag, currentUser){
		var self = this;
		
		$.ajaxPrefilter( function( opts ) {
			// opts.url = opts.url.replace(/^\/api\/(.*)/, "http://api.bithub.com/api/$1");
		});

		// routes - events
		can.route(':view', {view: 'latest', project: 'all', category: 'all'});
		can.route(':view/:project', {view: 'latest', project: 'all', category: 'all'});
		can.route(':view/:project/:category', {view: 'latest', project: 'all', category: 'all'});

		// routes - profile
		//can.route('profile/:username', {});
		
		var	newpostVisibility = can.compute(false),		
			projects = new can.Model.List(),
			categories = new can.Model.List();

		// Load category tags
		Tag.findAll({type: 'category'}, function (data) {
			categories.replace(data);
		});

		// Load project tags
		Tag.findAll({type: 'project'}, function (data) {
			projects.replace(data);
		});

		// Init Controllers
		new Login('#login', {
			currentUser: currentUser,
			newpostVisibility: newpostVisibility
		});
		new Events('#events');
		new Leaderboard('#leaderboard', { currentUser: currentUser });
		new Filterbar('#filterbar', {
			projects: projects,
			categories: categories
		});
		new Newpost('#newpost-form-container', {
			currentUser: currentUser,
			projects: projects,
			categories: categories,
			visibility: newpostVisibility
		});

		new UI.Onbottom(document);


	});
