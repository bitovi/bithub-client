steal(
	'can',
	'bithub/homepage/event_list/views/init.ejs',
	'bithub/homepage/event_list/views/latest.ejs',
	'bithub/homepage/event_list/views/greatest.ejs',
	'bithub/homepage/event_list/event_partials.js',
	'bithub/homepage/event_list/handlers',
	'ui/html_select',
	'bithub/homepage/event_list/spinner',
	'bithub/homepage/event_list/post_render',
	'bithub/homepage/event_list/latest_events_sorter.js',
	'bithub/models/event.js',
	'bithub/models/upvote.js',
	'bithub/models/award.js',
	'bithub/helpers/fun_helpers.js',
	'can/construct/proxy',
	'bithub/helpers/ejsHelpers.js',
	'ui/more',
	'can/observe/delegate',
	function (can, initView, latestView, greatestView, eventPartials, Handlers, HtmlSelect, Spinner, PostRendering, LatestEventsSorter, Event, Upvote, Award, f) {

		var areNotEmpty = _.compose(_.isEmpty, f.complement);

		// used for ordering categories on latest view
		var latestCategories = ['twitter', 'bug', 'comment', 'feature', 'question', 'article', 'plugin', 'app', 'event'],
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
			targetName: {
				fork: function(repo) { return repo.split('/')[1]; },
				watch: function(repo) { return repo.split('/')[1]; },
				follow: function(account) { return '@' + account; }
			},
			actorUrl: {
				fork: 'http://github.com/',
				watch: 'http://github.com/',
				follow: 'http://twitter.com/'
			}
		};

		var ChatScroll = can.Control.extend({
			init : function(){
			},
			'{day} types.chat add' : function(){
				setTimeout(this.proxy('adjustScroll'), 0);
			},
			adjustScroll : function(){
				this.element[0].scrollTop = this.element[0].scrollHeight;
			}
		});

		/* Some event_list specific helpers */
		can.extend(can.EJS.Helpers.prototype, {
			applyMore: function () {
				return function (el) {
					$(el).addClass('no-more');
				}
			},
			applyChatHeight: function (day) {
				return function (el) {
					new ChatScroll(el, {day: day})
				}
			}
			
		});


		return can.Control.extend({
			defaults: { }
		}, {

			init: function (elem, opts) {
				this.spinnerTop = can.compute(false);
				this.spinnerBottom = can.compute(false);
				this.canLoad = can.compute(true);
				this.canFetch = can.compute(true);
				this._newPaginationLoaded = can.compute(true);

				window.LATEST = this.latestEvents = new LatestEventsSorter;
				window.LATEST_IDX = this.latestIndex = new can.Observe.List([{}]);
				window.GREATEST = this.greatestEvents = new Bithub.Models.Event.List([{}]);

				this.currentView = can.compute('latest');

				this.data = {
					days: this.latestIndex,
					latestCategories: latestCategories,
					projects: opts.projects,
					categories: opts.categories,
					visibleTags: opts.visibleTags,
					digestDict: digestDict,
					user: this.options.currentUser
				}

				this.element.html(initView({
					data: this.data,
					view: this.currentView,
					latestView: latestView,
					greatestView: greatestView,
					partials: eventPartials,
					canLoad: this.canLoad
				}));

				new Handlers(this.element, {
					currentUser: this.options.currentUser,
					modals: this.options.modals
				});

				new Spinner(this.element, {
					spinnerTop: this.spinnerTop,
					spinnerBottom: this.spinnerBottom
				});

				new PostRendering(this.element);

				new HtmlSelect( this.element.find('#timespan-filter'), {
					items: [{value: 'day', display: 'Today'},
							{value: 'week',	display: 'This Week'},
							{value: 'month', display: 'This Month'},
							{value: 'all', display: 'All Time' }],
					currentValue: function() {
						return can.route.attr('timespan');
					},
					onChange: function( val ) {
						can.route.attr('timespan', val);
					},
					show: function() {
						return can.route.attr('view') == 'greatest';
					}
					
				});

				new HtmlSelect( this.element.find('#issue-state-filter'), {
					items: [{value: 'open', display: 'Open'},
							{value: 'closed', display: 'Closed'},
							{value: 'both', display: function() {
								return "All " + can.route.attr('category') + "s";
							}}],
					defaultValue: 'open',
					currentValue: function() {
						return can.route.attr('state') || 'open';
					},
					onChange: function( val ) {
						can.route.attr('state', val);
					},
					show: function() {
						if( ['bug','feature'].indexOf( can.route.attr('category') ) >= 0 ) {
							// set default to 'open'
							can.route.attr('state') == undefined && can.route.attr('state', 'open');
							return true;
						}
					}
					
				});

				this.spinnerTop(true);
			},

			'{preloadedEvents} add': function () {
				this.updateEvents(this.options.preloadedEvents);
			},

			// can.route listeners

			'{can.route} view': "reload",
			'{can.route} project': "reload",
			'{can.route} category': "reload",
			'{can.route} timespan': "reload",
			'{can.route} state': "reload",

			'{Bithub.Models.Event} reload': "reload",

			reload: function () {
				var self = this;

				this.canLoad(true);
				this._newPaginationLoaded(false);
				
				this.element.find('.events-list-wrapper').html('');

				this.options.queryTracker.reset(function() {
					self.spinnerTop(true);
					self._newPaginationLoaded(true);
					self.load(self.updateEvents);
				});
			},

			// infinite scroll

			'{window} onbottom': function (el, ev) {
				if( !this.canLoad() || !this.canFetch() ) { return; }

				this.options.queryTracker.next();
				this.spinnerBottom(true);
				this.load(this.appendEvents);
			},

			fillDocumentHeight: function() {
				if( $(document).height() <= ($(window).height() * 1.5) ) {
					this.canLoad() && this._newPaginationLoaded() && $(window).trigger('onbottom');
				}
			},

			/*
			 * Functions
			 */

			load: function (cb, params) {
				// events are preloaded in bithub.js immediately after can.route is initalized
				if (!window.EVENTS_PRELOADED) return;

				this.canFetch(false);
				
				clearTimeout(this.loadTimeout);
				this.loadTimeout = setTimeout(this.proxy(function () {
					Event.findAll(this.options.queryTracker.current(), this.proxy(cb));
				}), 10);
			},

			updateEvents: function (events) {
				var view = can.route.attr('view');

				events.length == 0 && this.canLoad(false);

				var data = can.extend({}, this.data),
					sortedEvents = new LatestEventsSorter(),
					renderer;

				if( view === 'latest' ) {
					renderer = latestView;
					sortedEvents.appendEvents( events );
					can.extend(data, {eventList: sortedEvents});
				} else {
					renderer = greatestView;
					can.extend(data, {eventList: events});
				}

				this.element.find('.events-list-wrapper').append(
					renderer({
						partials: eventPartials,
						data: data
					})
				);
				
				this.currentView(can.route.attr('view'));
				this.spinnerTop(false);
				this.spinnerBottom(false);
				this.canFetch(true);
				this.postRendering();
				window.scrollTo(0, 0);

				// load events until document height exceeds window height
				this.fillDocumentHeight();
			},

			appendEvents: function (events) {
				var view = can.route.attr('view'),
				daysNum = this.latestEvents.days.length;

				if (events.length === 0) {
					this.canLoad(false);
					this.spinnerBottom(false);
					return;
				}

				var data = can.extend({}, this.data),
					sortedEvents = new LatestEventsSorter(),
					renderer;

				if( view === 'latest' ) {
					renderer = latestView;
					sortedEvents.appendEvents( events );
					can.extend(data, {eventList: sortedEvents});
				} else {
					renderer = greatestView;
					can.extend(data, {eventList: events});
				}

				this.element.find('.events-list-wrapper').append(
					renderer({
						partials: eventPartials,
						data: data
					})
				);
				
				this.spinnerBottom(false);
				this.canFetch(true);
				this.postRendering();
			},

			postRendering: function () {
				this.element.trigger('rendered');
			}

		});
	}
);
