steal(
	'can',
	'bithub/homepage/event_list/views/init.ejs',
	'bithub/homepage/event_list/views/latest.mustache',
	'bithub/homepage/event_list/views/greatest.mustache',
	'bithub/homepage/event_list/determine_event_partial.js',
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
	'bithub/helpers/mustacheHelpers.js',
	'ui/more',
	'can/map/delegate',
	'bithub/entities',
	function (can, initView, latestView, greatestView, determineEventPartial, Handlers, HtmlSelect, Spinner, PostRendering, LatestEventsSorter, Event, Upvote, Award, f) {

		var areNotEmpty = _.compose(_.isEmpty, f.complement);

		// used for ordering categories on latest view
		var latestCategories = ['twitter', 'bug', 'comment', 'feature', 'question', 'article', 'plugin', 'app', 'event'];
		

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

		var isLatest = function() {
			return can.route.attr('view') == 'latest';
		}
		var	isGreatest = function() {
			return can.route.attr('view') == 'greatest';
		}

		
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
				this.spinnerTop      = can.compute(false);
				this.spinnerBottom   = can.compute(false);
				this._canLoad        = can.compute(true);
				this._paginatorReady = can.compute(true);
				

				window.LATEST = this.latestEvents = new LatestEventsSorter;
				window.LATEST_IDX = this.latestIndex = new can.List([{}]);
				window.GREATEST = this.greatestEvents = new Bithub.Models.Event.List([{}]);

				this.data = {
					days: this.latestIndex,
					latestCategories: latestCategories,
					projects: opts.projects,
					categories: opts.categories,
					visibleTags: opts.visibleTags,
					user: this.options.currentUser
				}

				this.element.html(initView({
					data: this.data,
					latestView: latestView,
					greatestView: greatestView,
					canLoad: this._canLoad
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

			'{can.route} view':     "reload",
			'{can.route} project':  "reload",
			'{can.route} category': "reload",
			'{can.route} timespan': "reload",
			'{can.route} state':    "reload",
			'{Bithub.Models.Event} reload': "reload",

			reload: function () {
				var self = this;

				this.element.find('.events-list-wrapper').html('');
				window.scrollTo(0, 0);

				this._canLoad(true);
				this._paginatorReady(false);					
				this.spinnerTop(true);

				this.options.queryTracker.reset(function() {
					self._paginatorReady(true);					
					self.load();
				});
			},

			// infinite scroll

			'{window} onbottom': function (el, ev) {
				
				if( !this._paginatorReady() ) { return; }

				this.options.queryTracker.next();
				this.options.queryTracker._onEndOfList() && this._canLoad(false);

				if( !this._canLoad() ) { return; }

				this.spinnerBottom(true);				
				this.load();
			},

			fillDocumentHeight: function() {
				//return
				if( $(document).height() <= ($(window).height() * 2) ) {
					$(window).trigger('onbottom');
				}
			},


			/*
			 * Functions
			 */

			load: function (cb, params) {
				// events are preloaded in bithub.js immediately after can.route is initalized
				if (!window.EVENTS_PRELOADED) return;

				var self = this;
								
				clearTimeout(this.loadTimeout);
				this.loadTimeout = setTimeout(function () {
					Event.findAll(self.options.queryTracker.current(), self.proxy(self.updateEvents));
				}, 10);
			},

			updateEvents: function( events ) {				
				var data = can.extend({}, this.data),
					sortedEvents = new LatestEventsSorter(),
					renderer = isLatest() ? latestView : greatestView;
									
				// this will block loading of greatest list
				if(events.length == 0) {
					this._canLoad(false);
				}
				
				isLatest() && sortedEvents.appendEvents( events );
				can.extend(data, {eventList: isLatest() ? sortedEvents : events});

				console.time('renderEvents')
				var content = renderer({
					data: data,
					hasCategoryFilter : function(){
						return can.route.attr('category') !== 'all';
					}
				}, {
					dailyCategories : function(opts){
						return can.map(latestCategories, function(category){
							var events = opts.context.attr('types.' + category);
							if(events && events.attr('length')){
								return opts.fn({
									currentCategory : category,
									events          : events,
									date            : opts.context.attr('date')
								})
							}
							return '';
						}).join('')
					},
					entityComponent : function(events, date){

						if(typeof events.length === 'undefined'){
							events = [events];
						}

						return can.map(events, function(event){
							var component = determineEventPartial(event.attr('tags')),
								template = '<{c} currentdate="date" event="event" data="data"></{c}>';

							return can.view.mustache(can.sub(template, {c: component})).render({
								data  : data,
								date  : date,
								event : event
							});

						}).join('')
					}
				})

				setTimeout(this.proxy(function(){
					this.element.find('.events-list-wrapper').append(content);
					console.timeEnd('renderEvents')
					this.spinnerTop(false);
					this.spinnerBottom(false);
					
					this.postRendering();
					this.fillDocumentHeight();
				}), 1)
				
			},
			
			postRendering: function () {
				this.element.trigger('rendered');
			}

		});
	}
);
