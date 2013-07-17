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
	'bithub/events/prepare_params.js',
	'bithub/modals',
	'bithub/models/event.js',
	'bithub/models/tag.js',
	'bithub/models/user.js',
	'bithub/helpers/loadtime.js',
	'ui/onbottom.js',
	'can/route/pushstate',
	'vendor/bootstrap',
	'vendor/bootstrap-datepicker',
	'assets/styles/bootstrap.css',
	'assets/styles/bootstrap-datepicker.css',
	'assets/styles/app.css',
	//'vendor/socketio/socket.io.js',
	function(can, PageSwitcher, Homepage, Profile, Activities, Filterbar, Login, Newpost, EventDetails, prepareParams, Modals, Event, Tag, User, loadtime) {
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
			categories = ['bug', 'issue', 'twitter', 'question', 'article', 'comment', 'app', 'code', 'chat', 'plugin', 'event'],
			views = ['greatest'];		

		// ROOT route
		can.route(routePrefix + '/', { page: 'homepage', view: 'latest', project: 'all', category: 'all' });
		can.route(routePrefix + '/profile', { page: 'profile' });
		can.route(routePrefix + '/profile/activities', { page: 'activities' });
		can.route(routePrefix + '/eventdetails/:id', { page: 'eventdetails' });

		for (var v in views) {
			can.route(routePrefix + '/'+views[v], { page: 'homepage', category:'all', project: 'all', view: views[v] });
			for (var p in projects) {
				can.route(routePrefix + '/'+projects[p], { page: 'homepage', view: 'latest', category: 'all', project: projects[p]});
				can.route(routePrefix + '/'+views[v]+'/'+projects[p], { page: 'homepage', category: 'all', view: views[v], project: projects[p]});
				for (var c in categories) {
					can.route(routePrefix + '/'+categories[c], { page: 'homepage', view: 'latest', project: 'all', category: categories[c] })
					can.route(routePrefix + '/'+projects[p]+'/'+categories[c], { page: 'homepage', view: 'latest', project: projects[p], category: categories[c] })
					can.route(routePrefix + '/'+views[v]+'/'+categories[c], { page: 'homepage', project: 'all', view: views[v], category: categories[c] });
					can.route(routePrefix + '/'+views[v]+'/'+projects[p]+'/'+categories[c], { page: 'homepage', view: views[v], project: projects[p], category: categories[c]});

					if (categories[c] !== 'twitter' && categories[c] !== 'code') {
						can.route(routePrefix + '/'+categories[c]+'s', { page: 'homepage', view: 'latest', project: 'all', category: categories[c] })
						can.route(routePrefix + '/'+projects[p]+'/'+categories[c]+'s', { page: 'homepage', view: 'latest', project: projects[p], category: categories[c] })
						can.route(routePrefix + '/'+views[v]+'/'+categories[c]+'s', { page: 'homepage', project: 'all', view: views[v], category: categories[c] });
						can.route(routePrefix + '/'+views[v]+'/'+projects[p]+'/'+categories[c]+'s', { page: 'homepage', view: views[v], project: projects[p], category: categories[c]});
					}
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
			projects          = new can.Model.List(),
			categories        = new can.Model.List(),
			currentUser       = new User({loggedIn: undefined}),
			preloadedEvents   = new Bithub.Models.Event.List();


		// Preload events on route init
		window.EVENTS_PRELOADED = false;
		var routeInitialized = false;
		
		can.route.bind('change', function() {			
			//console.log( "Route initialized after ", (new Date()) - window.START_TIME );			
			if( !routeInitialized ) {				
				routeInitialized = true;
				Event.findAll( prepareParams.prepareParams(), function( events ) {
					// this prevents events control to trigger on initial can.route change
					window.EVENTS_PRELOADED = true;
					preloadedEvents.replace(events);
				});
			}
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
			preloadedEvents: preloadedEvents,
			prepareParams: prepareParams,
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
			currentUser: currentUser,
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
