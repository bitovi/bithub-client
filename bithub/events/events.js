steal('can',
	'./views/init.ejs',
	'./views/latest.ejs',
	'./views/greatest.ejs',
	'./views/_event.ejs',
	'./views/_event_children.ejs',
	'./views/_digest.ejs',
	'./determine_event_partial.js',
	'bithub/models/event.js',
	'bithub/models/upvote.js',
	'bithub/models/award.js',
	'bithub/events/handlers',
	'bithub/events/spinner',
	'bithub/events/post_render',
	'./latest_events.js',
	'can/construct/proxy',
	'bithub/helpers/ejsHelpers.js',
	'ui/more',
	function (can,
		initView,
		latestView,
		greatestView,
		eventPartial,
		eventChildrenPartial,
		digestPartial,
		determineEventPartial,
		Event,
		Upvote,
		Award,
		Handlers,
		Spinner,
		PostRendering,
		LatestEvents
	) {

		// lookup table for dynamic loading of event partials 


		// used for ordering categories on latest view
		var latestCategories = ['twitter', 'bug', 'comment', 'feature', 'question', 'article', 'plugin', 'app', 'code', 'event'],
			digestDict = {
				actions: {
					fork: 'forked',
					follow: 'followed',
					watch: 'started watching'
				},
				targetUrl: {
					fork: 'http://github.com/',
					watch: 'http://github.com/',
					follow: 'http://twitter.com/'
				},
				actorUrl: {
					fork: 'http://github.com/',
					watch: 'http://github.com/',
					follow: 'http://twitter.com/'
				}
			}

		can.EJS.Helpers.prototype.applyMore = function () {
			return function (el) {
				$(el).addClass('no-more');
			}
		}

		can.EJS.Helpers.prototype.applyChatHeight = function () {
			return function (el) {
				$(el).addClass('no-chat-height');
			}
		}

		return can.Control({}, {
			init: function (elem, opts) {
				var self = this;

				this.spinner = can.compute(false);
				this.spinnerBottom = can.compute(false);

				window.LATEST = this.latestEvents = new LatestEvents;
				window.LATEST_IDX = this.latestIndex = new can.Observe.List([{}]);
				window.GREATEST = this.greatestEvents = new Bithub.Models.Event.List([{}]);

				this.currentView = can.compute('latest');

				/* TODO: live updating
				opts.socket && opts.socket.on('new_event', function( event ) {
				console.log( event );
				});
				*/

				can.extend(can.EJS.Helpers.prototype, {
					isAdmin: function () {
						return opts.currentUser.attr('admin');
					}
				});


				this.element.html(initView({
					latestEvents: self.latestEvents,
					days: self.latestIndex,
					greatestEvents: self.greatestEvents,
					partial: this.currentView,
					latestView: latestView,
					greatestView: greatestView,
					eventPartial: eventPartial,
					determineEventPartial: determineEventPartial,
					eventChildrenPartial: eventChildrenPartial,
					digestPartial: digestPartial,
					latestCategories: latestCategories,
					projects: opts.projects,
					categories: opts.categories,
					digestDict: digestDict
				}));

				new Handlers(this.element, {
					currentUser: this.options.currentUser,
					modals: this.options.modals
				});

				new Spinner(this.element, {
					spinner: this.spinner,
					spinnerBottom: this.spinnerBottom
				});

				new PostRendering(this.element);

				this.spinner(true);
			},

			'{preloadedEvents} add': function () {
				this.updateEvents(this.options.preloadedEvents);
			},

			// can.route listeners

			'{can.route} view': "reload",
			'{can.route} project': "reload",
			'{can.route} category': "reload",

			'{Bithub.Models.Event} reload': "reload",

			reload: function () {
				this.options.prepareParams.resetFilter();
				this.spinner(true);
				this.load(this.updateEvents);
			},

			// infinite scroll

			'{window} onbottom': function (el, ev) {
				var views = this.options.prepareParams.views;

				if (can.route.attr('view') === 'latest') {
					views.latest.attr('offset', views.latest.offset + views.latest.limit);
				} else {
					views.greatest.attr('offset', views.greatest.offset + views.greatest.limit);
				}

				this.spinnerBottom(true);
				this.load(this.appendEvents);
			},

			/*
			 * Functions
			 */

			load: function (cb, params) {
				// events are preloaded in bithub.js immediately after can.route is initalized
				if (!window.EVENTS_PRELOADED) return;

				clearTimeout(this.loadTimeout);
				this.loadTimeout = setTimeout(this.proxy(function () {
					Event.findAll(this.options.prepareParams.prepareParams(), this.proxy(cb));
				}), 10);
			},

			updateEvents: function (events) {
				var view = can.route.attr('view');

				if (view === 'latest') {
					this.latestEvents.appendEvents(events)
				} else if (view === 'greatest') {
					this.greatestEvents.replace(events);
				}

				this.currentView(can.route.attr('view'));
				this.spinner(false);
				this.postRendering();
				window.scrollTo(0, 0);
			},

			appendEvents: function (events) {
				var view = can.route.attr('view');

				if (view === 'latest') {
					this.latestEvents.appendEvents(events);
					this.spinner(false);
				} else if (view === 'greatest') {
					this.greatestEvents.push.apply(this.greatestEvents, events);
					this.spinnerBottom(false);
				}
				this.postRendering();
			},

			postRendering: function () {
				this.element.trigger('rendered');
			}


		});
	});