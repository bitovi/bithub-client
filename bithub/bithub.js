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
	'bithub/eventdetails',
	'bithub/modals',
	'bithub/models/tag.js',
	'bithub/models/user.js',
	'bithub/helpers/loadtime.js',
	'ui/onbottom.js',
	'can/route/pushstate',
	'vendor/bootstrap/bootstrap.js',
	'assets/styles/bootstrap.css',
	'assets/styles/app.css',
	//'vendor/socketio/socket.io.js',
	function(can, PageSwitcher, Homepage, Profile, Activities, Filterbar, Login, Newpost, EventDetails, Modals, Tag, User, loadtime) {
		var self = this;

		// display load time 
		loadtime();
		
		$.ajaxPrefilter( function( opts ) {
			// opts.url = opts.url.replace(/^\/api\/(.*)/, "http://api.bithub.com/api/$1");
		});

		// connect to live service
		// if( typeof(io) !== 'undefined' ) {
		//	var socket = io.connect('http://localhost:3000');
		// }
		
		// routes - events

		var routePrefix = '';
		
	    var projects = ['canjs', 'donejs', 'javascriptmvc', 'funcunit', 'jquerypp', 'stealjs', 'canui'],
			categories = ['bug', 'issue', 'twitter', 'question', 'article', 'comment', 'app', 'code', 'chat', 'plugin'],
			views = ['greatest'];		

		// ROOT route
		can.route(routePrefix + '', { page: 'homepage', view: 'latest', project: 'all', category: 'all' });
		can.route(routePrefix + '/profile', { page: 'profile' });
		can.route(routePrefix + '/profile/activities', { page: 'activities' });

		for (var v in views) {
			can.route(routePrefix + '/'+views[v], { page: 'homepage', view: views[v] });
			for (var p in projects) {
				can.route(routePrefix + '/'+projects[p], { page: 'homepage', view: 'latest', project: projects[p]});
				can.route(routePrefix + '/'+views[v]+'/'+projects[p], { page: 'homepage', view: views[v], project: projects[p]});
				for (var c in categories) {
					can.route(routePrefix + '/'+categories[c], { page: 'homepage', view: 'latest', category: categories[c] })
					can.route(routePrefix + '/'+projects[p]+'/'+categories[c], { page: 'homepage', view: 'latest', project: projects[p], category: categories[c] })
					if (categories[c] !== 'twitter' && categories[c] !== 'code') {
						can.route(routePrefix + '/'+categories[c]+'s', { page: 'homepage', view: 'latest', category: categories[c] })
						can.route(routePrefix + '/'+projects[p]+'/'+categories[c]+'s', { page: 'homepage', view: 'latest', project: projects[p], category: categories[c] })
					}
					can.route(routePrefix + '/'+views[v]+'/'+categories[c]+'s', { page: 'homepage', view: views[v], category: categories[c] });
					can.route(routePrefix + '/'+views[v]+'/'+projects[p]+'/'+categories[c]+'s', { page: 'homepage', view: views[v], project: projects[p], category: categories[c]});
				}
			}
		}

		can.route(routePrefix + '/:project', { page: 'homepage', view: 'latest', project: 'all', category: 'all' });
		can.route(routePrefix + '/:category', { page: 'homepage', view: 'latest', project: 'all', category: 'all' });
		can.route(routePrefix + '/:project/:category', { page: 'homepage', view: 'latest', project: 'all', category: 'all' });
		can.route(routePrefix + '/:view', { page: 'homepage', view: 'latest', project: 'all', category: 'all' });
		can.route(routePrefix + '/:view/:project', { page: 'homepage', view: 'latest', project: 'all', category: 'all' });
		can.route(routePrefix + '/:view/:category', { page: 'homepage', view: 'latest', project: 'all', category: 'all' });
		can.route(routePrefix + '/:view/:project/:category', { page: 'homepage', view: 'latest', project: 'all', category: 'all' });

		// Page WTF
		can.route(routePrefix + '/:page/:view/:project/:category', { page: 'homepage', view: 'latest', project: 'all', category: 'all' });
		
		var	newpostVisibility = can.compute(false),
			projects = new can.Model.List(),
			categories = new can.Model.List(),
			currentUser = new User({loggedIn: false});
		
		currentUser.fromSession();

		// Init Controllers
		var modals = new Modals('#bootstrapModals', {
			currentUser: currentUser
		});
		
		new PageSwitcher('#pages', {
			routeAttr: 'page',
			controls: {
				'homepage': Homepage,
				'eventdetails': EventDetails,
				'profile': Profile,
				'activities': Activities
			},
			currentUser: currentUser,
			categories: categories,
			projects: projects,
			newpostVisibility: newpostVisibility,
			modals: modals
			//socket: socket
		});

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
		
		// Load category tags
		Tag.findAll({type: 'category'}, function (data) {
			categories.replace(data);
		});

		// Load project tags
		Tag.findAll({type: 'project'}, function (data) {
			projects.replace(data);
		});

		
		new UI.Onbottom(document);

	});
