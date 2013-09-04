steal(
	'can',
	'../helpers/auth.js',
	'../helpers/github.js',
	function (can, auth, github) {
		var parse10 = function(str) { return parseInt(str, 10) };
		var existy = function(x) { return x!==null && x!==undefined };
		var isStringNully = function(x) { return x===null || x===undefined };

		var cleanupData = function (data) {
			data.activities = _.filter(data.activities, function(el) {
				return parse10(el.value || el.authorship_value) !== 0;
			});

			_.each(_.keys(data), function(key) {
				if (isStringNully(data[key])) data[key] = '';
			});

			return data;
		}

		var providers = {
			twitter: { url: '/api/auth/twitter' },
			github: { url: '/api/auth/github' }			
		};

		var User = can.Model.extend('Bithub.Models.User', {
			init: function () {},

			// CRUD
			findAll : 'GET /api/users',
			findOne : 'GET /api/users/{id}',
			create  : 'POST /api/users',
			update  : 'PUT /api/users/{id}'

		}, {
			fromSession: function() {
				var self = this;
				can.ajax({
					url: '/api/auth/session',
					type: 'GET'
				}).done(function(data) {
					self.attr(cleanupData(data));
					self.attr('isLoggedIn', true);
				}).fail(function(response) {
					self.attr('isLoggedIn', false);
					console.error(response);
				});
			},
			
			isLoggedIn: function() {
				return this.attr('isLoggedIn');
			},

			isAdmin: function() {
				return _.include(this.attr('roles'), 'admin');
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

			queryGithub: function( endpoint, cb ) {
				var	provider = this.getIdentity('github');

				if( !provider ) return;

				var user = provider.source_data.login || provider.source_data.nickname;
				
				var endpoints = {
					// later switch to "watched";  http://developer.github.com/changes/2012-9-5-watcher-api/
					watched: "https://api.github.com/users/" + user + "/subscriptions",
					starred: "https://api.github.com/users/" + user + "/starred"
				}

				github.query( endpoints[endpoint], cb );
			}

		});

		return User;
	}
);
 
