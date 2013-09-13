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

	// replace with '/assets/less/production.less'
	//'assets/styles/bootstrap.css',
	//'assets/styles/bootstrap-datepicker.css',
	'assets/styles/app.css',
	function(can, PageSwitcher, Navigator, Login, Newpost, prepareParams, Modals, Event, Tag, User, loadtime) {
		var self = this;

		if( steal.isBuilding ) {
			return
		}
		can.route.ready(false);

		// Display load time 
		loadtime();
		
		// Routes

		var projects = ['canjs', 'donejs', 'javascriptmvc', 'funcunit', 'jquerypp', 'stealjs', 'canui'],
			categories = ['bug', 'issue', 'twitter', 'question', 'article', 'comment', 'app', 'code', 'chat', 'plugin', 'event', 'feature'],
			timespans = ['day', 'week', 'month', 'all'];

		var routes = [{
			params: ['admin'],
			paramKey: 'page',
			defaultProps: {view: 'users', action: 'list'},
			childs: [{
				params: ['tags', 'users', 'rewards', 'achievements'],
				paramKey: 'view',
				childs: [{
					params: ['edit', 'new'],
					paramKey: 'action'
				}]
			}]
		},{
			params: ['latest'],
			paramKey: 'view',
			defaultProps: {page: 'homepage', view: 'latest', project: 'all', category: 'all', timespan: 'all'},	
			childs: [{
				params: categories,
				paramKey: 'category'
			},{
				params: projects,
				paramKey: 'project',
				childs: [{
					params: categories,
					paramKey: 'category'
				}]
			}]
		},{
			params: ['greatest'],
			paramKey: 'view',
			defaultProps: {page: 'homepage', view: 'latest', project: 'all', category: 'all', timespan: 'week'},	
			childs: [{
				params: timespans,
				paramKey: 'timespan'
			},{
				params: categories,
				paramKey: 'category',
				childs: [{
					params: timespans,
					paramKey: 'timespan'
				}]
			},{
				params: projects,
				paramKey: 'project',
				childs: [{
					params: timespans,
					paramKey: 'timespan'
				},{
					params: categories,
					paramKey: 'category',
					childs: [{
						params: timespans,
						paramKey: 'timespan'
					}]
				}]
			}]
		}];

		var declareRoute = function( coll, prefix, exclude ) {
			prefix = prefix || '/';
			exclude = exclude || [];

			return (prefix + _.difference(coll, exclude).join('/')).replace('//','/');
		};

		var genRoutes = function( routes, prefix, props ) {
			prefix = prefix || '/';
			props = props || {};
			
			_.each(routes, function(v, k, l) {
				var params = v.params,
					childs = v.childs,
					key = v.paramKey,
					defaultProps = v.defaultProps;
				
				_.each(params, function(v, k, l) {
					var exclude = (defaultProps && defaultProps[key]) || [];
					var route = declareRoute( [v], prefix, exclude );

					var newProps = {};
					_.extend(newProps, defaultProps, props)
					newProps[key] = v;
					
					//console.log( route, newProps );
					can.route( route, newProps );
					
					if( childs ) {
						genRoutes( childs, route + '/', newProps );
					}
				});	
			});
		};

		genRoutes( routes );

		can.route('/earnpoints', { page: 'earnpoints' });
		can.route('/rewards', { page: 'rewards' });

		can.route('/profile', { page: 'profile', view: 'info' });
		can.route('/profile/activities', { page: 'profile', view: 'activities' });
		can.route('/profile/rewards', { page: 'profile', view: 'rewards' });
		can.route('/profile/earn-points', { page: 'profile', view: 'earnpoints' });

		can.route('/event/:id', { page: 'eventdetails' });
		
		can.route.ready(true);
		
		var	newpostVisibility = can.compute(false),
			projects          = new can.Model.List(),
			categories        = new can.Model.List(),
			feeds             = new can.Model.List(),
			users             = new Bithub.Models.User.List(),
			currentUser       = new User({isLoggedIn: undefined}),
			preloadedEvents   = new Bithub.Models.Event.List([{}]),
			visibleTags       = new can.Observe.List();
		
		CURRENT_USER = currentUser;

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

			if( attr === 'isLoggedIn' ) {
				newVal === true ? $('.logged-out').fadeOut( speed ) : $('.logged-in').fadeOut( speed );
				setTimeout(function() {
					self.attr('loggedInDelayed', newVal );
					newVal === true ? $('.logged-in').fadeIn( speed ) : $('.logged-out').fadeIn( speed );
				}, speed - 10 );
			}
		});

		// Initialize the current user (if there is one)
		currentUser.fromSession();

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
			modals: modals,
			users: users,
			visibleTags: visibleTags
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
			modals: modals,
			projects: projects,
			categories: categories,
			visibility: newpostVisibility,
			project: can.route.attr('newpost_p') || '',
			category: can.route.attr('newpost_c') || ''
		});
	
		can.route.attr('newpost') && newpostVisibility(true);


		var updateVisibleTags = function( tags, props ) {
			var buffer = _.each(tags.attr(), function(item) {
				can.extend(item, props);
			});
			visibleTags.push.apply(visibleTags, buffer);
		}
		
		// Load category tags
		Tag.findAll({type: 'category'}, function (data) {
			categories.replace(data);
			updateVisibleTags( data, {type: 'category'} );
		});

		// Load project tags
		Tag.findAll({type: 'project'}, function (data) {
			projects.replace(data);
			updateVisibleTags( data, {type: 'project'} );
		});

		// Load feed tags
		Tag.findAll({type: 'feed'}, function (data) {
			feeds.replace(data);
		});

		// Load leaderboar
		User.findAll( {cached: true}, function (data) {
			users.replace(data);
		});

		new UI.Onbottom(document, {treshold: 200});
	}
);
