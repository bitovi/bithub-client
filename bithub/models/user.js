steal(
	'can',
	'../helpers/auth.js',
	'../helpers/github.js',
	'../helpers/data.js',
	'can/map/delegate',
	function (can, auth, github, dataHelpers) {

		var providers = {
			twitter: { url: '/api/auth/twitter' },
			github: { url: '/api/auth/github' },
			meetup: { url: '/api/auth/meetup' }
		};

		var bindLoggedInState = function(ev, attr, how, newVal, oldVal) {
			var self = this,
				speed = 300,
				newVal = this.loggedIn();

			newVal === true ? $('.logged-out').fadeOut( speed ) : $('.logged-in').fadeOut( speed );
			setTimeout(function() {
				self.attr('loggedInDelayed', newVal );
				newVal === true ? $('.logged-in').fadeIn( speed ) : $('.logged-out').fadeIn( speed );
			}, speed - 10 );
		};
			

		var User = can.Model.extend('Bithub.Models.User', {

			findAll : 'GET  /api/v1/users',
			findOne : 'GET  /api/v1/users/{id}',
			//create  : 'POST /api/users',
			update  : 'PUT  /api/v1/users/{id}'

		}, {
			fromSession: function() {
				var self = this;

				this.delegate('authStatus', 'change', can.proxy(bindLoggedInState, this));

				this.loadSession(function( data ) {
					self.attr( dataHelpers.cleanup(data) );
					self.attr('authStatus', 'loggedIn');
					self.executeDelayedActions();
				}, function( response ) {
					self.attr('authStatus', 'loggedOut');
					console.error( response );
				});
			},

			refreshSession: function() {
				var self = this;

				this.loadSession( function( data ) {
					self.attr( dataHelpers.cleanup(data) );
				});
			},

			loadSession: function( cbDone, cbFail) {
				can.ajax({
					url: '/api/auth/session',
					type: 'GET'
				}).done( cbDone ).fail( cbFail );
			},
			
			loggedIn: function( val ) {
				if( val == undefined ) {
					return this.attr('authStatus') == 'loggedIn';

					// check providers
				} else if( ['twitter','github','meetup'].indexOf(val) >= 0 ) {
					this.login(val);
				} else if( val == false ) {
					this.logout();
				}
			},

			delayedActions: function( func ) {				
				if (typeof func == "function") {

					if( can.isArray(this.attr('delayedActions')) ) {
						this.attr('delayedActions').push(func);
					} else {
						this.attr('delayedActions', [func]);
					}					
				}
				
				return this.attr('delayedActions');
			},

			executeDelayedActions: function() {
				if( !this.attr('delayedActions') ) return;
				
				while(this.attr('delayedActions').length) {
					this.attr('delayedActions').shift()();
				}
			},
			
			loggingIn: function() {
				return this.attr('authStatus') == 'loggingIn';
			},

			isAdmin: function() {
				return _.include(this.attr('roles'), 'admin');
			},

			hasEmail: function() {
				return !!this.attr('email'); 
			},

			hasAddress: function() {
				return !!this.attr('address') && !!this.attr('postal') && !!this.attr('country') && !!this.attr('city');
			},

			isCompleted: function() {
				return this.hasEmail() && this.hasAddress();
			},

			getIdentity: function( provider ) {
				return _.first( _.filter(this.attr('identities'), function( identity ) {
					return identity.attr('provider') == provider;
				}));
			},

			login: function(provider) {
				this.attr('authStatus', 'loggingIn');
				auth.login.call(this, providers[provider] );
			},

			logout: function() {
				this.attr('authStatus', 'loggedOut');
				auth.logout.apply(this);
			},

			manageRoles: function(action, role) {
				var self = this;
				can.ajax({
					url: '/api/users/'+self.id+'/'+action+'role',
					data: { role: role },
					type: 'PUT'
				}).done(function(data) {
					self.attr('roles', data.roles);
				})
			},

			filterActivities: function( condFn, pluckProp ) {
				var filtered =  _.filter( this.attr('activities'), condFn );
				return pluckProp ? _.pluck( filtered, pluckProp ) : filtered;
			},

			watchedRepos: function() {
				return can.map(can.grep(this.attr('activities') || [], function(activity){
					var title = activity.attr('title');
					return title && title.indexOf('started watching bitovi/') == 0
				}), function(activity){
					return activity.attr('title')
				});
			},

			followedAccounts: function() {
				var followes = this.filterActivities( function( activity ) {
					if( activity.attr('title') && activity.attr('title').indexOf('followed @') == 0 ) 
						return activity;
				}, 'title');

				return _.map(followes, function( account ) {
					return account.split('@')[1];
				});
			},
			isLoggedIn : function(){
				return this.attr('authStatus') === 'loggedIn';
			},
			hasVotedFor : function(event){
				if(!event){
					return false;
				}
				return (this.attr('upvoted_events') || []).indexOf(event.attr('id')) > -1;
			},
			loadActivities : function(){
				var self = this;
				Bithub.Models.Activity.findAll({userId: this.attr('id')}, function(activities){
					self.attr('activities', self.attr('activities') || []);
					self.attr('activities').replace(activities);
				}) 
			},
			avatarUrl : function(){
				var defaultAvatar = '/assets/images/icon-user.png',
					currentAvatar = this.attr('avatar_url') || defaultAvatar,
					identities, sourceData;
				if(currentAvatar === defaultAvatar){
					identities = this.attr('identities');
					for(var i = 0; i < identities.length; i++){
						sourceData = identities[i].source_data;
						currentAvatar = (
							sourceData.image || 
							sourceData.avatar_url ||
							sourceData.profile_image_url ||
							defaultAvatar
						)
						if(currentAvatar !== defaultAvatar){
							return currentAvatar;
						}
					}
				}
				return currentAvatar;
			}

		});

		can.Model.List('Bithub.Models.User.List', {
			topUser: function() {
				if (this.attr('length') == 0) return;
				
				var bestUser = this.attr(0);
				
				this.each(function( user, idx ) {
					if( user.attr('score') > bestUser.attr('score') ) {
						bestUser = user;
					}
				});

				return bestUser;
			}
		});

		return User;
	}
);
 
