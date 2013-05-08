// Load all of the plugin dependencies
steal(
	'can',
	'bithub/pageswitcher',
	'bithub/homepage',
	'bithub/profile',
	'bithub/activities',
	'bithub/filterbar',
	'bithub/login',
	'bithub/newpost',
	'bithub/liveservice',
	'bithub/models/tag.js',
	'bithub/models/user.js',
	'ui/onbottom.js',
	'bithub/assets/styles/bootstrap.css',
	'bithub/assets/styles/app.css',
	function(can, PageSwitcher, Homepage, Profile, Activities, Filterbar, Login, Newpost, LiveService, Tag, User){
		var self = this;
		
		$.ajaxPrefilter( function( opts ) {
			// opts.url = opts.url.replace(/^\/api\/(.*)/, "http://api.bithub.com/api/$1");
		});

		// routes - events
		can.route(':page', {page: 'homepage', view: 'latest', project: 'all', category: 'all'});
		can.route(':page/:view', {page: 'homepage', view: 'latest', project: 'all', category: 'all'});
		can.route(':page/:view/:project', {page: 'homepage', view: 'latest', project: 'all', category: 'all'});
		can.route(':page/:view/:project/:category', {page: 'homepage', view: 'latest', project: 'all', category: 'all'});
		
		var	newpostVisibility = can.compute(false),		
			projects = new can.Model.List(),
			categories = new can.Model.List(),
			latestEvents = new Bithub.Models.Event.List(),
			greatestEvents = new Bithub.Models.Event.List(),			
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

		new PageSwitcher('#pages', {
			routeAttr: 'page',
			controls: {
				'homepage': Homepage,
				'profile': Profile,
				'activities': Activities
			},
			currentUser: currentUser,
			categories: categories,
			projects: projects,
			latestEvents: latestEvents,
			greatestEvents: greatestEvents
		});

		
		//new LiveService(window, {
		//	latestEvents: latestEvents			
		//});

	});
