steal(
	'can',
	'bithub/homepage/event_list/views/init.ejs',
	'bithub/homepage/event_list/views/latest.ejs',
	'bithub/homepage/event_list/views/greatest.ejs',
	'bithub/homepage/event_list/views/_event.ejs',
	'bithub/homepage/event_list/views/_event_children.ejs',
	'bithub/homepage/event_list/views/_digest.ejs',
	'bithub/homepage/event_list/determine_event_partial.js',
	'bithub/homepage/event_list/handlers',
	'bithub/homepage/event_list/timespan_filter',
	'bithub/homepage/event_list/issue_state_filter',
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
	function (can, initView, latestView, greatestView, eventPartial, eventChildrenPartial, digestPartial, determineEventPartial, Handlers, TimespanFilter, IssueStateFilter, Spinner, PostRendering, LatestEventsSorter, Event, Upvote, Award, f) {

		var visibleTags = new can.Observe.List();				
		var areNotEmpty = _.compose(_.isEmpty, f.complement);

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
			},
			renderEventTags: function (event) {
				var buffer = "";

				can.each(event.attr('tags'), function( eventTag ) {
					var matched = false;

					visibleTags.each(function( visibleTag ) {
						var name = visibleTag.attr('name'),
						display_name = visibleTag.attr('display_name') || visibleTag.attr('name');

						if( name == eventTag && !matched ) {
							buffer += "<li class=\"tag-name " + name +  "\"><a href=\"#\"><small>" + name + "</small></a></li>";
							matched = true;
						}
					});
				});
				return buffer;
			}
		});


		return can.Control.extend({
			defaults: { }
		}, {

			init: function (elem, opts) {
				this.spinnerTop = can.compute(false);
				this.spinnerBottom = can.compute(false);
				this.canLoad = can.compute(true);

				window.LATEST = this.latestEvents = new LatestEventsSorter;
				window.LATEST_IDX = this.latestIndex = new can.Observe.List([{}]);
				window.GREATEST = this.greatestEvents = new Bithub.Models.Event.List([{}]);

				this.currentView = can.compute('latest');

				can.extend(can.EJS.Helpers.prototype, {
					isAdmin: function () {
						return opts.currentUser.isAdmin();
					},

					isLoggedIn: function () {
						return opts.currentUser.isLoggedIn();
					}
				});

				this.element.html(initView({
					latestEvents: this.latestEvents,
					days: this.latestIndex,
					greatestEvents: this.greatestEvents,
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
					visibleTags: visibleTags,
					digestDict: digestDict,
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
				new TimespanFilter(this.element.find('#timespan-filter'));
				new IssueStateFilter(this.element.find('#issue-state-filter'));

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
				this.options.prepareParams.resetFilter();
				this.canLoad(true);
				this.spinnerTop(true);
				this.load(this.updateEvents);
			},

			// only "meaningful" event tags should be displayed

			'{categories} change': "updateTagList",
			'{projects} change': "updateTagList",
			'{feeds} change': "updateTagList",

			updateTagList: function( tags ) {
				visibleTags.push.apply(visibleTags, tags);
			},

			// infinite scroll

			'{window} onbottom': function (el, ev) {
				var queryTracker = this.options.prepareParams.queryTracker.homepage;

				if (!this.canLoad()) { return; }				

				if (can.route.attr('view') === 'latest') {
					queryTracker.latest.attr('offset', queryTracker.latest.offset + queryTracker.latest.limit);
				} else {
					queryTracker.greatest.attr('offset', queryTracker.greatest.offset + queryTracker.greatest.limit);
				}

				this.spinnerBottom(true);
				this.load(this.appendEvents);
			},

			fillDocumentHeight: function() {
				if( $(document).height() <= $(window).height() + 200 ) {
					this.canLoad() && $(window).trigger('onbottom');
				}				
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

				events.length == 0 && this.canLoad(false);

				if (view === 'latest') {
					this.latestEvents.replace(events)
				} else if (view === 'greatest') {
					this.greatestEvents.replace(events);
				}

				this.currentView(can.route.attr('view'));
				this.spinnerTop(false);
				this.spinnerBottom(false);
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
					this.spinnerTop(false);
					this.spinnerBottom(false);
					return;
				}

				if (view === 'latest') {
					this.latestEvents.appendEvents(events);
				} else if (view === 'greatest') {
					this.greatestEvents.push.apply(this.greatestEvents, events);
				}

				this.spinnerBottom(false);

				// load events until document height exceeds window height
				this.fillDocumentHeight();

				// always load entire day for chat
				if( can.route.attr('category') === 'chat' ) {
					if (this.latestEvents.days.length === daysNum) {
						$(window).trigger('onbottom');
					}
				}

				this.postRendering();
			},

			postRendering: function () {
				this.element.trigger('rendered');
			}

		});
	}
);
