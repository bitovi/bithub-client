steal('can',
	  './init.mustache',
	  function(can, initView){

		  var watched = new can.Observe.List(),
			  starred = new can.Observe.List(),
			  events = {
				  twitter: new can.Observe.List(),
				  question: new can.Observe.List(),
				  //issue: new can.Observe.List(),
				  code: new can.Observe.List(),
				  article: new can.Observe.List(),
				  app: new can.Observe.List(),
				  plugin: new can.Observe.List()				  
			  }

		  var defaultParams = {
			  limit: 3,
			  order: 'thread_updated_at'			  
		  }

		  return can.Control.extend({
				  defaults : {}
			  }, {
				  init : function( elem, opts ){
					  var self = this,
						  user = opts.currentUser;
					  
					  this.element.html(initView({
						  user: user,
						  events: events
					  }, {
						  helpers: {
							  hasProvider: function( provider, opts ) {
								  return user.getIdentity( provider ) ? opts.fn(this) : opts.inverse(this);
							  },
							  isWatched: function( repo, opts ) {
								  watched.attr('length');
								  return _.filter(watched, function( item ) {
									  return item.attr('name') == repo;
								  }).length ? opts.fn(this) : opts.inverse(this);
							  }

						  },
						  partials: {}
					  }));

					  if( user.isLoggedIn() ) {
						  this.loadGithub();
						  this.loadEvents();
					  }
				  },

				  '{currentUser} isLoggedIn change': function() {
					  this.loadGithub();
					  this.loadEvents();
				  },

				  loadGithub: function() {
					  var user = this.options.currentUser;

					  user.queryGithub("watched", function( data ) {
						  watched.replace( data );
					  });
				  },

				  loadEvents: function() {
					  defaultParams.author_id = this.options.currentUser.attr('id');

					  _.each(_.keys(events), function(category) {
						  Bithub.Models.Event.findAll(can.extend({category: category}, defaultParams), function( data ) {
							  events[category].replace( data );
						  });
					  });
				  },				  

				  // handlers

				  '#connect-github-link click': function( el, ev ) {
					  ev.preventDefault();
					  this.options.currentUser.login('github');
				  },

				  '#connect-twitter-link click': function( el, ev ) {
					  ev.preventDefault();
					  this.options.currentUser.login('twitter');
				  },

				  '#submit-article-link click': function( el, ev ) {
					  ev.preventDefault();
					  can.route.attr('newpost_c', 'article');
					  this.options.newpostVisibility( true );					  
				  },

				  '#submit-app-link click': function( el, ev ) {
					  ev.preventDefault();
					  can.route.attr('newpost_c', 'app');
					  this.options.newpostVisibility( true );
				  },
				  
				  '#submit-plugin-link click': function( el, ev ) {
					  ev.preventDefault();
					  can.route.attr('newpost_c', 'plugin');
					  this.options.newpostVisibility( true );
				  }

			  });
	  });
