// Load all of the plugin dependencies
steal(
	'can',
	'bithub/pageswitcher',
	'bithub/navigator',
	'bithub/login',
	'bithub/newpost',
	'bithub/homepage/event_list/prepare_params.js',
	'bithub/modals',
	'bithub/models/event.js',
	'bithub/models/tag.js',
	'bithub/models/user.js',
	'bithub/helpers/loadtime.js',
	'ui/onbottom.js',
	'can/route/pushstate',
	'vendor/bootstrap',
	'vendor/bootstrap-datepicker',
	'vendor/lodash',
	'assets/styles/bootstrap.css',
	'assets/styles/bootstrap-datepicker.css',
	'assets/styles/app.css',
	//'vendor/socketio/socket.io.js',
	function(can, PageSwitcher, Navigator, Login, Newpost, prepareParams, Modals, Event, Tag, User, loadtime) {
		var self = this;

		if( steal.isBuilding ) {
			return
		}
		can.route.ready(false);

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

		var routePrefix = '/bithub';
		
	    var projectNames = ['canjs', 'donejs', 'javascriptmvc', 'funcunit', 'jquerypp', 'stealjs', 'canui'],
			categoryNames = ['bug', 'issue', 'twitter', 'question', 'article', 'comment', 'app', 'code', 'chat', 'plugin', 'event'],
			viewNames = ['greatest'],
			timespanNames = ['day', 'week', 'month'];

		// ROOT route
		can.route(routePrefix + '', { page: 'homepage', view: 'latest', project: 'all', category: 'all' });
		can.route(routePrefix + '/', { page: 'homepage', view: 'latest', project: 'all', category: 'all' });

		can.route(routePrefix + '/profile', { page: 'profile', view: 'info' });
		can.route(routePrefix + '/profile/activities', { page: 'profile', view: 'activities' });

		can.route(routePrefix + '/admin', { page: 'admin', view: 'users', action: 'list' });

		can.route(routePrefix + '/admin/tags', { page: 'admin', view: 'tags', action: 'list' });
		can.route(routePrefix + '/admin/tags/edit', { page: 'admin', view: 'tags', action: 'edit' });
		can.route(routePrefix + '/admin/tags/new', { page: 'admin', view: 'tags', action: 'new' });

		can.route(routePrefix + '/admin/users', { page: 'admin', view: 'users', action: 'list' });
		can.route(routePrefix + '/admin/users/edit', { page: 'admin', view: 'users', action: 'edit' });
		can.route(routePrefix + '/admin/users/new', { page: 'admin', view: 'users', action: 'new' });

		can.route(routePrefix + '/admin/rewards', { page: 'admin', view: 'rewards', action: 'list' });
		can.route(routePrefix + '/admin/rewards/edit', { page: 'admin', view: 'rewards', action: 'edit' });
		can.route(routePrefix + '/admin/rewards/new', { page: 'admin', view: 'rewards', action: 'new' });


		can.route(routePrefix + '/events/:id', { page: 'homepage', view: 'details' });
		can.route(routePrefix + '/rewards', { page: 'homepage', view: 'rewards' });

		for (var v in viewNames) {
			can.route(routePrefix + '/'+viewNames[v], { page: 'homepage', category:'all', project: 'all', timespan: 'week', view: viewNames[v] });

			for (var ts in timespanNames) {
				can.route(routePrefix + '/'+viewNames[v]+'/'+timespanNames[ts], { page: 'homepage', view: viewNames[v], project: 'all', category: 'all', timespan: timespanNames[ts] });
			}

			for (var p in projectNames) {
				can.route(routePrefix + '/'+projectNames[p], { page: 'homepage', view: 'latest', category: 'all', timespan: 'week', project: projectNames[p]});
				can.route(routePrefix + '/'+viewNames[v]+'/'+projectNames[p], { page: 'homepage', category: 'all', timespan: 'week', view: viewNames[v], project: projectNames[p]});

				for (var ts in timespanNames) {
					can.route(routePrefix + '/'+viewNames[v]+'/'+projectNames[p]+'/'+timespanNames[ts], { page: 'homepage', view: viewNames[v], project: projectNames[p], category: 'all', timespan: timespanNames[ts] });
				}
				
				for (var c in categoryNames) {
					can.route(routePrefix + '/'+categoryNames[c], { page: 'homepage', view: 'latest', project: 'all', timespan: 'week', category: categoryNames[c] })
					can.route(routePrefix + '/'+projectNames[p]+'/'+categoryNames[c], { page: 'homepage', view: 'latest', timespan: 'week', project: projectNames[p], category: categoryNames[c] })
					can.route(routePrefix + '/'+viewNames[v]+'/'+categoryNames[c], { page: 'homepage', project: 'all', timespan: 'week', view: viewNames[v], category: categoryNames[c] });
					can.route(routePrefix + '/'+viewNames[v]+'/'+projectNames[p]+'/'+categoryNames[c], { page: 'homepage', timespan: 'week', view: viewNames[v], project: projectNames[p], category: categoryNames[c]});

					for (var ts in timespanNames) {
						can.route(routePrefix + '/'+viewNames[v]+'/'+categoryNames[c]+'/'+timespanNames[ts], { page: 'homepage', view: viewNames[v], project: 'all', category: categoryNames[c], timespan: timespanNames[ts]});
						can.route(routePrefix + '/'+viewNames[v]+'/'+projectNames[p]+'/'+categoryNames[c]+'/'+timespanNames[ts], { page: 'homepage', view: viewNames[v], project: projectNames[p], category: categoryNames[c], timespan: timespanNames[ts]});
					}
					
					if (categoryNames[c] !== 'twitter' && categoryNames[c] !== 'code') {
						can.route(routePrefix + '/'+categoryNames[c]+'s', { page: 'homepage', view: 'latest', project: 'all', timespan: 'week', category: categoryNames[c] })
						can.route(routePrefix + '/'+projectNames[p]+'/'+categoryNames[c]+'s', { page: 'homepage', view: 'latest', timespan: 'week', project: projectNames[p], category: categoryNames[c] })
						can.route(routePrefix + '/'+viewNames[v]+'/'+categoryNames[c]+'s', { page: 'homepage', project: 'all', timespan: 'week', view: viewNames[v], category: categoryNames[c] });
						can.route(routePrefix + '/'+viewNames[v]+'/'+projectNames[p]+'/'+categoryNames[c]+'s', { page: 'homepage', timespan: 'week', view: viewNames[v], project: projectNames[p], category: categoryNames[c]});
					}
				}
			}
		}

		can.route(routePrefix + '/:project', { page: 'homepage', view: 'latest', project: 'all', category: 'all', timespan: 'week' });
		can.route(routePrefix + '/:category', { page: 'homepage', view: 'latest', project: 'all', category: 'all', timespan: 'week' });
		can.route(routePrefix + '/:project/:category', { page: 'homepage', view: 'latest', project: 'all', category: 'all', timespan: 'week' });
		can.route(routePrefix + '/:view', { page: 'homepage', view: 'latest', project: 'all', category: 'all', timespan: 'week' });
		can.route(routePrefix + '/:view/:project', { page: 'homepage', view: 'latest', project: 'all', category: 'all', timespan: 'week' });
		can.route(routePrefix + '/:view/:category', { page: 'homepage', view: 'latest', project: 'all', category: 'all', timespan: 'week' });
		can.route(routePrefix + '/:view/:project/:category', { page: 'homepage', view: 'latest', project: 'all', category: 'all', timespan: 'week' });

		can.route.ready(true);
		
		var	newpostVisibility = can.compute(false),
			projects          = new can.Model.List(),
			categories        = new can.Model.List(),
			feeds             = new can.Model.List(),
			currentUser       = new User({loggedIn: undefined}),
			preloadedEvents   = new Bithub.Models.Event.List([{}]);


		// Preload events on route init
		window.EVENTS_PRELOADED = false;

		Event.findAll( prepareParams.prepareParams(), function( events ) {
			// this prevents events control to trigger on initial can.route change
			window.EVENTS_PRELOADED = true;
			preloadedEvents.replace(events);

			// trigger change manually if there are no events
			events.length == 0 && preloadedEvents._triggerChange('length', 'add');
		});
		
		// move this somewhere else
		currentUser.bind('change', function(ev, attr, how, newVal, oldVal) {
			var self = this,
				speed = 300;

			if( attr === 'loggedIn' ) {
				newVal === true ? $('.logged-out').fadeOut( speed ) : $('.logged-in').fadeOut( speed );
				setTimeout(function() {
					self.attr('loggedInDelayed', newVal );
					newVal === true ? $('.logged-in').fadeIn( speed ) : $('.logged-out').fadeIn( speed );
				}, speed - 10 );
			}
		});

		// Initialize the current user (if there is one)
		currentUser.fromSession();

		// Set the brand to point to root url
		$('.container .brand').attr('href', can.route.url({ page: 'homepage', view: 'latest', project: 'all', category: 'all' }));
		
		// Init Controllers
		var modals = new Modals('#bootstrapModals', {
			currentUser: currentUser
		});
		
		new PageSwitcher('#pages', {
			currentUser: currentUser,
			preloadedEvents: preloadedEvents,
			prepareParams: prepareParams,
			projects: projects,
			feeds: feeds,
			categories: categories,
			newpostVisibility: newpostVisibility,
			modals: modals
			//socket: socket
		});

		new Navigator('#navigator', {
			currentUser: currentUser,
			projects: projects,
			categories: categories
		});

		new Login('#login', {
			currentUser: currentUser,
			newpostVisibility: newpostVisibility
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

		// Load feed tags
		Tag.findAll({type: 'feed'}, function (data) {
			feeds.replace(data);
		});

		new UI.Onbottom(document, {treshold: 200});
	}
);
