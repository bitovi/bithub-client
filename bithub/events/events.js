steal('can',
	  './init.ejs',
	  './latest.ejs',
	  './greatest.ejs',
	  './_event.ejs',
	  './_event_children.ejs',
	  './_digest.ejs',
	  './determine_event_partial.js',
	  'bithub/models/event.js',
	  'bithub/models/upvote.js',
	  'bithub/models/award.js',
	  'bithub/events/handlers',
	  'bithub/events/spinner',
	  'bithub/events/post_render',
	  'can/construct/proxy',
	  'bithub/helpers/ejsHelpers.js',
	  'ui/more',
	  function(can,
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
			   PostRendering
			  ) {

		  var emptyReqCounter = 0,
			  emptyReqTreshold = 5,
			  
			  // lookup table for dynamic loading of event partials 
			  
			  
			  // used for ordering categories on latest view
			  latestCategories = ['twitter','bug', 'comment', 'feature', 'question', 'article', 'plugin', 'app', 'code', 'event'];

		  can.EJS.Helpers.prototype.applyMore = function() {
			  return function(el) {
				  $(el).addClass('no-more');
			  }
		  }
				  
		  can.EJS.Helpers.prototype.applyChatHeight = function() {
			  return function(el) {
				  $(el).addClass('no-chat-height');
			  }
		  }
				  
		  return can.Control(
			  {
			  }, {
				  init : function( elem, opts ){
					  var self = this;

					  this.spinner = can.compute(false);
					  this.spinnerBottom = can.compute(false);

					  window.LATEST        = this.latestEvents   = new Bithub.Models.Event.List([{}]);
					  window.LATEST_IDX    = this.latestIndex    = new can.Observe.List([{}]);
					  window.GREATEST      = this.greatestEvents = new Bithub.Models.Event.List([{}]);
					  
					  this.currentView = can.compute('latest');
					  
					  /* TODO: live updating
					  opts.socket && opts.socket.on('new_event', function( event ) {
						  console.log( event );
					  });
					   */

					  can.extend(can.EJS.Helpers.prototype, {
						  isAdmin: function() {
							  return opts.currentUser.attr('admin');
						  }
					  });
					  
					  this.element.html( initView({
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
						  categories: opts.categories
					  }) );

					  new Handlers(this.element, {
					  	currentUser : this.options.currentUser,
					  	modals      : this.options.modals
					  });

					  new Spinner(this.element, {
					  	spinner : this.spinner,
					  	spinnerBottom : this.spinnerBottom
					  });

					  new PostRendering(this.element);

					  this.spinner(true);
				  },

				  '{preloadedEvents} change': function() {
					  this.updateEvents( this.options.preloadedEvents );
				  },
				  
				  // can.route listeners

				  '{can.route} view': "reload",				  
				  '{can.route} project': "reload",
				  '{can.route} category': "reload",

				  '{Bithub.Models.Event} reload': "reload",

				  reload: function() {
					  this.options.prepareParams.resetFilter();
					  this.spinner(true);
					  this.load( this.updateEvents );
				  },

				  // infinite scroll
				  
				  '{window} onbottom': function( el, ev ) {
					  var views = this.options.prepareParams.views;
					  
					  if (can.route.attr('view') === 'latest') {
						  if (can.route.attr('project') !== 'all' || can.route.attr('category') !== 'all') {
							  views.latest.attr('offset', views.latest.offset + views.latest.limit);
						  } else {
							  this.options.prepareParams.decrementLatestDate();
						  }
					  } else {
						  views.greatest.attr('offset', views.greatest.offset + views.greatest.limit);
					  }

					  this.spinnerBottom(true);
					  this.load( this.appendEvents );
				  },

				  /*
				   * Functions
				   */

				  load: function( cb, params ) {
					  // events are preloaded in bithub.js immediately after can.route is initalized
					  if( !window.EVENTS_PRELOADED ) return;
					  
					  clearTimeout( this.loadTimeout );
					  this.loadTimeout = setTimeout( this.proxy( function () {
						  Event.findAll( this.options.prepareParams.prepareParams(), this.proxy( cb ) );
					  }) );
				  },

				  updateLatest: function( events ) {
				  	console.log(can.map(events, function(e){
				  		return e.attr('thread_updated_at')
				  	}))
					  if (events.length == 0 && ++emptyReqCounter < emptyReqTreshold) {
						  this.options.prepareParams.decrementLatestDate();
						  this.load( this.updateLatest );
					  } else {
						  emptyReqCounter = 0;
						  this.latestEvents.replace( events );
						  this.latestIndex.replace( events.latest() );
						  this.spinner( false );
						  this.postRendering();
					  }
					  this.currentView( can.route.attr('view') );
				  },
				  
				  appendLatest: function( events ) {
					  var self = this,
						  buffer = new can.Observe.List( this.latestIndex ),
						  offset = this.latestEvents.length;

					  $.each(events.latest( offset ), function( i, day ) {
						  // merge with previous day or push new day
						  if (buffer[buffer.length-1].attr('date') === day.date) {
							  for( var category in day ) {
								  if (buffer[buffer.length-1][category]) {
									  can.merge( buffer[buffer.length-1][category], day[category] );
								  } else {
									  buffer[buffer.length-1].attr(category, day[category])
								  }
							  };
						  } else {
							  buffer.push( day );
						  }
					  });

					  this.latestEvents.push.apply(this.latestEvents, events );					  
					  this.latestIndex.replace( buffer );
					  this.postRendering();
				  },
				  
				  updateGreatest: function( events ) {
					  this.greatestEvents.replace( events );
					  this.spinner(false);
					  this.currentView( can.route.attr('view') );
					  this.postRendering();
				  },
				  
				  appendGreatest: function( events ) {
					  this.greatestEvents.push.apply(this.greatestEvents, events );
					  this.spinnerBottom(false);
					  this.postRendering();
				  },

				  updateEvents: function( events ) {					  
					  (can.route.attr('view') === 'latest') ? this.updateLatest( events ) : this.updateGreatest( events );
					  window.scrollTo(0, 0);
				  },

				  appendEvents: function( events ) {
					  (can.route.attr('view') === 'latest') ? this.appendLatest( events ) : this.appendGreatest( events );
				  },

				  postRendering : function(){
				  	this.element.trigger('rendered');
				  }

				  
			  });
	  });
