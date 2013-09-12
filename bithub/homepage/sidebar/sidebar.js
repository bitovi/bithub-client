steal(
	'can',
	'./sidebar.mustache',
	'bithub/homepage/sidebar/leaderboard',
	'bithub/models/reward.js',
	'bithub/helpers/mustacheHelpers.js',
	function(can, sidebarView, Leaderboard, Reward){

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

				Reward.findAll({order: 'point_minimum'}, function( data ) {
					rewards.replace( data );
					self.onLogin();
				});

				elem.html(sidebarView({
					user: user,
					rewards: rewards,
					accomplishments: accomplishments,
					routes: {
						earnpoints: function() {
							var params = {
								view: 'earnpoints',
								page: user.isLoggedIn() ? 'profile' : 'homepage'
							}
								
							return can.route.url( params )
						}
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
							
							if( user.isLoggedIn() ) {
								rewardsUrl = can.route.url({page: 'profile', view: 'rewards'});
								start = rewards.nextRewardIdx( user.attr('achievements') );
								stop = start + 2;
							} else {
								if( rewards.attr('length') > 2 ) {
									start = _.random(0, rewards.attr('length')-2),
									stop = start + 2;
								}
							}

							// trigger template to update
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
				
				if( opts.currentUser.isLoggedIn() ) {
					this.matchRewards();
				}
				
				new Leaderboard(elem.find('#leaderboard'), opts);
			},

			'{currentUser} isLoggedIn' : "onLogin",
			'{rewards} length': "onLogin",
			'{users} length': "onLogin",

			onLogin: function() {
				this.matchRewards();
				this.updateAccomplishments();
			},
			
			matchRewards: function() {
				this.options.rewards.matchAchievements( this.options.currentUser, this.options.users );
			},

			updateAccomplishments: function() {
				var user = this.options.currentUser;

				// profile
				accomplishments.attr('profile.twitter', user.getIdentity('twitter') ? true : false);
				accomplishments.attr('profile.github', user.getIdentity('github') ? true : false);
				accomplishments.attr('profile.completed', user.isCompleted());

				/*
				// watched github repos
				user.queryGithub('watched', function( repos ) {
					_.each(repos, function( repo ) {
						if( accomplishments.attr('githubWatch')[repo.name] != undefined ) accomplishments.attr('githubWatch.' + repo.name, true);
					});
				});
				 */

				// Twitter followes
				var followes = user.filterActivities( function( activity ) {
					if( activity.attr('title') && activity.attr('title').indexOf('followed @') == 0 ) 
						return activity;
				}, 'title');

				_.each(followes, function( account ) {
					accomplishments.attr('twitterFollow.' + account.split('@')[1], true);
				});

				// Github watches
				var watches = user.filterActivities( function( activity ) {
					if( activity.attr('title') && activity.attr('title').indexOf('started watching bitovi/') == 0 ) 
						return activity;
				}, 'title');

				_.each(watches, function( account ) {
					accomplishments.attr('githubWatch.' + account.split('/')[1], true);
				});

				console.log( accomplishments );
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
