steal(
	'can',
	'../helpers/auth.js',
	'../helpers/github.js',
	'../helpers/data.js',
	function (can, auth, github, dataHelpers) {

		var providers = {
			twitter: { url: '/api/auth/twitter' },
			github: { url: '/api/auth/github' }			
		};

		var User = can.Model.extend('Bithub.Models.User', {

			findAll : 'GET  /api/users',
			findOne : 'GET  /api/users/{id}',
			//create  : 'POST /api/users',
			update  : 'PUT  /api/users/{id}'

		}, {
			fromSession: function() {
				var self = this;

				this.loadSession(function( data ) {
					self.attr( dataHelpers.cleanup(data) );
					self.attr('isLoggedIn', true);
				}, function( response ) {
					self.attr('isLoggedIn', false);
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
			
			isLoggedIn: function() {
				return this.attr('isLoggedIn');
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
				auth.login.call(this, providers[provider] );
			},

			logout: function() {
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
				var watches = this.filterActivities( function( activity ) {
					if( activity.attr('title') && activity.attr('title').indexOf('started watching bitovi/') == 0 ) 
						return activity;
				}, 'title');
				
				return _.map(watches, function( account ) {
					var repo = github.matchRepo(account);
					return repo && repo.repo;
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
 
