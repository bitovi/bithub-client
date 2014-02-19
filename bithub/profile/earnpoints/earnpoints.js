steal('can',
		'./init.mustache',
		'bithub/homepage/sidebar/leaderboard',
		function(can, initView, Leaderboard){

			var watched = new can.List(),
				starred = new can.List(),
				events = {
					twitter: new can.List(),
					bug: new can.List(),
					feature: new can.List(),
					code: new can.List(),
					article: new can.List(),
					app: new can.List(),
					plugin: new can.List(),
					event: new can.List()
				},
				topPosts = new can.List();

			var eventsParams = {
				order: ['upvotes:desc', 'thread_updated_ts:desc'],
				limit: 3
			};

			var topPostsParams = {
				order: ['upvotes:desc', 'thread_updated_ts:desc'],
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

						user.isLoggedIn() && user.loadActivities();

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
										return item == repo;
									}).length ? opts.fn(this) : opts.inverse(this);
								},
								eventDetailsUrl: function() {
									return can.route.url({page: 'eventdetails', id: this.attr('id')});
								}

							},
							partials: {}
						}));

						new Leaderboard(elem.find('.leaderboard'), {
							currentUser: opts.currentUser,
							users: opts.users
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
								return (a.attr('upvotes') - b.attr('upvotes'))
							});
							loaded( _.keys(events).length ); // reset
						}
					},

					'{currentUser} authStatus' : function() {
						if( this.options.currentUser.isLoggedIn() ) {
							this.options.currentUser.loadActivities();
						}
					},

					'{currentUser} activities' : function(){
						var self = this;
						setTimeout(function(){
							self.loadGithub();
							self.loadEvents();
							self.loadTopPosts();
						}, 1);
					},

					loadGithub: function() {
						watched.replace( this.options.currentUser.watchedRepos() );
					},

					loadEvents: function() {
						var loaded = this.options.loaded;

						eventsParams.author_id = this.options.currentUser.attr('id');

						_.each(_.keys(events), function(category) {
							var params = can.extend({category: category}, eventsParams);

							if(category === 'event'){
								params.order     = 'thread_updated_ts:asc';
								params.in_future = true;
							}

							Bithub.Models.Event.findAll(params, function( data ) {
								events[category].replace( data );
								loaded( loaded()-1 );
							});
						});
					},

					mergeList: function( dst, src, condFn ) {
						src.forEach(function( from ) {
							if(can.inArray(from, dst) === -1){
								dst.push(from)
							}
						});
						[].sort.call(dst, condFn)
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

					'#connect-meetup-link click': function( el, ev ) {
						ev.preventDefault();
						this.options.currentUser.login('meetup');
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
					},

					'#submit-event-link click': function( el, ev ) {
						ev.preventDefault();
						can.route.attr('newpost_c', 'event');
						this.options.newpostVisibility( true );
					},
					"{window} userLinkError" : function(el, ev, msg){
						alert(msg);
					}

				});
		});
