steal('can',
	  './init.mustache',
	  'bithub/homepage/sidebar/leaderboard',
	  function(can, initView, Leaderboard){

		  var watched = new can.Observe.List(),
			  starred = new can.Observe.List(),
			  events = {
				  twitter: new can.Observe.List(),
				  question: new can.Observe.List(),
				  bug: new can.Observe.List(),
				  feature: new can.Observe.List(),
				  code: new can.Observe.List(),
				  article: new can.Observe.List(),
				  app: new can.Observe.List(),
				  plugin: new can.Observe.List()				  
			  },
			  topPosts = new can.Observe.List();

		  var eventsParams = {
			  order: 'upvotes:desc',
			  limit: 3
		  };

		  var topPostsParams = {
			  order: 'upvotes:desc',
			  limit: 5
		  };

		  return can.Control.extend({
				  defaults : {
					  loaded: can.compute( _.keys(events).length )
				  }
			  }, {
				  init : function( elem, opts ){
					  var self = this,
						  user = opts.currentUser;
					  
					  this.element.html(initView({
						  user: user,
						  events: events,
						  posts: topPosts
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

					  new Leaderboard(elem.find('.leaderboard'), {
						  currentUser: opts.currentUser
					  });

					  this.loadTopPosts();

					  if( user.isLoggedIn() ) {
						  this.loadGithub();
						  this.loadEvents();
					  }
				  },

				  '{loaded} change': function( fn, ev , newVal, oldVal ) {
					  var loaded = this.options.loaded;
					  
					  if( newVal == 0 ) {
						  this.mergeList(events.bug, events.feature, function(a, b) {
							  return (a.attr('upvotes') <= b.attr('upvotes'))
						  });
						  loaded( _.keys(events).length ); // reset
					  }
				  },

				  '{currentUser} isLoggedIn change': function() {
					  this.loadGithub();
					  this.loadEvents();
					  this.loadTopPosts();
				  },

				  loadGithub: function() {
					  var user = this.options.currentUser;

					  user.queryGithub("watched", function( data ) {
						  watched.replace( data );
					  });
				  },

				  loadEvents: function() {
					  var loaded = this.options.loaded;
					  
					  eventsParams.author_id = this.options.currentUser.attr('id');

					  _.each(_.keys(events), function(category) {
						  Bithub.Models.Event.findAll(can.extend({category: category}, eventsParams), function( data ) {
							  events[category].replace( data );
							  loaded( loaded()-1 );
						  });
					  });
				  },

				  mergeList: function( dst, src, condFn ) {
					  var insertAt = 0;
					  src.forEach(function( from ) {
						  dst.forEach(function( to, idx ) {
							  if( condFn(from, to) ) {
								  insertAt = idx;
							  }
						  });
						  dst.splice(insertAt, 0, from);
					  });
				  },

				  loadTopPosts: function() {
					  var user = this.options.currentUser;
					  var params = can.extend({}, topPostsParams);
					  
					  if( user.isLoggedIn() ) params.author_id = user.attr('id');
					  
					  Bithub.Models.Event.findAll(params, function( data ) {
						  topPosts.replace( data );
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
