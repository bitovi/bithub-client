steal(
	'can',
	'./sidebar.mustache',
	'bithub/homepage/sidebar/leaderboard',
	'bithub/models/reward.js',
	'bithub/models/accomplishment.js',
	'bithub/helpers/mustacheHelpers.js',
	function(can, sidebarView, Leaderboard, Reward, Accomplishment){

		var accomplishments = new can.Observe({
			profile: {
				github: false,
				twitter: false,
				completed: false
			},
			twitterFollow: {
				bitovi: false,
				canjs: false,
				jquerypp: false,
				javascriptmvc: false,
				funcunit: false
			},
			githubWatch: {
				javascriptmvc: false,
				canjs: false,
				jquerypp: false,
				funcunit: false,
				documentjs: false,
				steal: false
				//'testee.js': false
			}
		});
		
		return can.Control.extend({
			defaults : {
				rewards: new Bithub.Models.Reward.List()
			}
		}, {
			init : function( elem, opts ) {
				var self = this,
					rewards = this.options.rewards,
					user = this.options.currentUser;

				this.meetupList = new can.List;

				Reward.findAll({order: 'point_minimum'}, function( data ) {
					var filtered = _.filter(data, function( reward ) {
						if (!reward.disabled_ts) return reward;
					});
					rewards.replace( filtered );
					self.onLogin();
				});

				elem.html(sidebarView({
					user: user,
					rewards: rewards,
					accomplishments: accomplishments,
					meetups : this.meetupList,
					routes: {
						earnpoints: can.route.url({page: 'earnpoints'}, false),
						rewards: can.route.url({page: 'rewards'}, false),
						meetups : can.route.url({category: 'event'}, true)
					}
				}, {
					helpers: {
						pickUndone: function( coll, opts ) {
							coll = (typeof(coll) === 'function') ? coll() : coll;

							var undone = _.filter( _.keys(coll.attr()), function(task) {
								if( !coll.attr(task) ) return task;
							});

							if (undone.length > 0) {
								return opts.fn( can.extend(this, {picked: undone[_.random(0, undone.length-1)]}) )
							} else {
								return opts.inverse(this);
							}

						},
						
						iterRewards: function( opts ) {
							var buffer = "",
								rewardsUrl = can.route.url({page: 'rewards'}),
								start = 0,
								stop = 2;
							
							if( user.loggedIn() ) {
								start = rewards.nextRewardIdx( user.attr('achievements') );
								if( start >= rewards.attr('length')-1 ) start--;
								stop = start + 2;
							} else {
								if( rewards.attr('length') > 2 ) {
									start = _.random(0, rewards.attr('length')-2),
									stop = start + 2;
								}
							}

							rewards.attr('length');
							
							for( var i = start; i < stop; i++ ) {
								buffer += opts.fn({
									reward: rewards.attr(i),
									rewardsUrl: rewardsUrl
								});
							}

							return buffer;
						}
					}
				}));
				
				if( opts.currentUser.loggedIn() ) {
					this.matchRewards();
				}
				
				new Leaderboard(elem.find('#leaderboard'), opts);
				Bithub.Models.Event.findLatest({funnel_name: 'event', limit: 3, order: 'thread_updated_ts:asc', in_future: true}).then(this.proxy('fillEvents'));
			},
			fillEvents : function(events){
				this.meetupList.replace(events);
			},
			'{currentUser} authStatus' : function() {
				if( this.options.currentUser.loggedIn() ) {
					this.onLogin();
				}				
			},
			'{rewards} length': "onLogin",
			'{users} length': "onLogin",

			onLogin: function() {
				this.matchRewards();
				Bithub.Models.Activity.findAll({userId : this.options.currentUser.id}, this.proxy('updateAccomplishments'));
			},
			
			matchRewards: function() {
				this.options.rewards.matchAchievements( this.options.currentUser, this.options.users );
			},

			updateAccomplishments: function(acc) {
				var user = this.options.currentUser;
				// profile
				accomplishments.attr('profile.twitter', user.getIdentity('twitter') ? true : false);
				accomplishments.attr('profile.github', user.getIdentity('github') ? true : false);
				accomplishments.attr('profile.completed', user.isCompleted());
				
				_.each(acc.followedAccounts(), function( account ) {
					accomplishments.attr('twitterFollow.' + account, true);
				});

				_.each(acc.watchedRepos(), function( repo ) {
					accomplishments.attr('githubWatch.' + repo, true);
				});
			},

			'#twitter-modal-btn click': function( el, ev ) {
				ev.preventDefault();
				this.options.modals.showTwitter();
			},

			'#show-new-post-form-btn click': function( el, ev ) {
				ev.preventDefault();
				this.options.newpostVisibility(true);
			},
			
			'#connect-github click': function( el, ev ) {
				ev.preventDefault();
				this.options.currentUser.login('github');
			},

			'#connect-twitter click': function( el, ev ) {
				ev.preventDefault();
				this.options.currentUser.login('twitter');
			}
		})
	}
);
