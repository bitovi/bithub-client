steal(
	'can',
	'bithub/homepage/event_list/views/init.mustache',
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
		
		var __templatesCache = {};


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
			return can.route.attr('view') === 'latest';
		}
		var	isGreatest = function() {
			return can.route.attr('view') === 'greatest';
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
				var self = this;
				this.spinnerTop      = can.compute(false);
				this.spinnerBottom   = can.compute(false);
				this._canLoad        = can.compute(true);
				this._paginatorReady = can.compute(true);

				this.data = {
					user: this.options.currentUser
				}

				this.element.html(initView({
					doneLoading: function(){
						var check = !self._canLoad();
						return check && !self.spinnerTop() && !self.spinnerBottom();
					}
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

			'{can.route} view'            : "reload",
			'{can.route} project'         : "reload",
			'{can.route} category'        : "reload",
			'{can.route} timespan'        : "reload",
			'{can.route} state'           : "reload",
			'{Bithub.Models.Event} reload': "reload",

			reload: function () {
				var self = this, eventsGroup, removeEventGroup;

				if(this._loader){
					this._loader.abort();
					delete this._loader;
				}

				window.scrollTo(0, 0);
				this.setCanLoad(true);
				this._paginatorReady(false);
				this.spinnerTop(true);

				this.__cleanup = function(){
					self.element.find('.events-list-wrapper').empty();
				}

				this.options.queryTracker.reset(function() {
					self._paginatorReady(true);
					self.load(true);
				});
			},

			// infinite scroll

			'{window} onbottom': function (el, ev) {
				
				if( !this._paginatorReady() || this._loader ) { return; }

				this.options.queryTracker.next();

				if(this.options.queryTracker._onEndOfList()){
					this.setCanLoad(false);
					return;
				}

				this.spinnerBottom(true);
				this.load(true);
			},

			fillDocumentHeight: function() {
				var self = this;
				setTimeout(function(){
					var fillHeight = self.element.find('.events-list-wrapper').innerHeight(),
						windowHeight = $(window).height();

					if(self._canLoad() && (fillHeight < windowHeight + (windowHeight / 2)) ) {
						$(window).trigger('onbottom');
					}
				}, 1)
			},


			/*
			 * Functions
			 */

			load: function (useCurrent) {
				var self   = this,
					method = useCurrent ? 'current' : 'next';

				// events are preloaded in bithub.js immediately after can.route is initalized
				if (!window.EVENTS_PRELOADED) return;

				clearTimeout(this.loadTimeout);
				this.loadTimeout = setTimeout(function () {
					if(self.__cleanup){
						self.__cleanup();
						delete self.__cleanup;
					}
					self.spinnerBottom(true);

					self._loader = Event.findAll(self.options.queryTracker[method](), self.proxy('updateEvents'));
				}, 10);
			},

			updateEvents: function( events ) {
				var data         = can.extend({}, this.data),
					sortedEvents = new LatestEventsSorter(),
					renderer     = isLatest() ? latestView : greatestView,
					initGroups   = [],
					content, initGroup, append;

				delete this._loader;

				// this will block loading of greatest list
				if(!isLatest() && events.length === 0) {
					this.setCanLoad(false);
				} else if(!this.options.queryTracker.hasNext() && events.length === 0){ // end of latest
					this.setCanLoad(false);
				} else if(events.length === 0){ // sometimes pagination says there's an event when there is none
					$(window).trigger('resetOnBottom');
				}

				isLatest() && sortedEvents.appendEvents( events );
				can.extend(data, {eventList: isLatest() ? sortedEvents : events});

				console.time('renderEvents')
				
				content = renderer({
					data: data,
					hasCategoryFilter : function(){
						return can.route.attr('category') !== 'all';
					}
				}, {
					dailyCategories : function(opts){
						var date = opts.context.attr('date');
						return can.map(latestCategories, function(category){
							var events = opts.context.attr('types.' + category);
							if(events && events.length){
								return opts.fn({
									currentCategory : category,
									events : events,
									date   : date
								})
							}
							return '';
						}).join('');
					},
					entityComponent : function(events, date){
						var counter = 0;
						if(typeof events.length === 'undefined'){
							events = [events];
						}

						return can.map(events, function(event){
							var component = determineEventPartial(event.attr('tags')),
								template = '<{c} currentdate="date" event="event" inited="inited"></{c}>',
								result;

							if(counter % 2 === 0){
								counter = 0;
								initGroups.push(can.compute(false));
							}

							if(typeof __templatesCache[component] === 'undefined'){
								__templatesCache[component] = can.view.mustache(can.sub(template, {c: component}));
							}

							result = __templatesCache[component].render({
								date  : date,
								event : event,
								inited : initGroups[initGroups.length - 1]
							});

							counter++;

							return result;

						}).join('');
					}
				})

				initGroup = function(){
					initGroups.shift()(true);
					if(initGroups.length){
						setTimeout(initGroup, 1);
					} else {
						setTimeout(append, 1);
					}
				}

				append = this.proxy(function(){
					this.element.find((isLatest() ? '.greatest' : '.latest') + '-group').remove();
					this.element.find('.events-list-wrapper').append(content);
					console.timeEnd('renderEvents');
					this.spinnerTop(false);
					this.spinnerBottom(false);
					
					this.postRendering();
					this.fillDocumentHeight();
				})

				initGroups.length ? initGroup() : append();
				
			},

			setCanLoad : function(canLoad){
				this._canLoad(canLoad);
			},
			
			postRendering: function () {
				this.element.trigger('rendered');
			}

		});
	}
);