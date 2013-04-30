// Load all of the plugin dependencies
steal(
	'can',
	'bithub/pageswitcher',
	'bithub/events',
	'bithub/leaderboard',
	'bithub/filterbar',
	'bithub/login',
	'bithub/newpost',
	'bithub/profile',
	'bithub/models/tag.js',
	'bithub/models/user.js',
	'ui/onbottom.js',
	'bithub/assets/styles/bootstrap.css',
	'bithub/assets/styles/app.css',
	function(can, PageSwitcher, Events, Leaderboard, Filterbar, Login, Newpost, Profile, Tag, User){
		var self = this;
		
		$.ajaxPrefilter( function( opts ) {
			// opts.url = opts.url.replace(/^\/api\/(.*)/, "http://api.bithub.com/api/$1");
		});

		// routes - events
		can.route(':page', {page: 'events', view: 'latest', project: 'all', category: 'all'});
		can.route(':page/:view', {page: 'events', view: 'latest', project: 'all', category: 'all'});
		can.route(':page/:view/:project', {page: 'events', view: 'latest', project: 'all', category: 'all'});
		can.route(':page/:view/:project/:category', {page: 'events', view: 'latest', project: 'all', category: 'all'});
		
		var	newpostVisibility = can.compute(false),		
			projects = new can.Model.List(),
			categories = new can.Model.List(),
			currentUser = new User({loggedIn: false});

		currentUser.fromSession();

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

		new Profile('#profile', {
			currentUser: currentUser
		});

		new UI.Onbottom(document);


	}).then(
		'can',
		'bithub/pageswitcher',
		function( can, PageSwitcher ) {
			new PageSwitcher('#pages');		
		});
