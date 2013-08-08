steal(
	'can',
	'../helpers/auth.js',
	function (can, auth) {

		var providers = {
			twitter: { url: '/api/auth/twitter' },
			github: { url: '/api/auth/github' }			
		};

		var User = can.Model('Bithub.Models.User', {
			init: function () {},

			// CRUD
			findAll : 'GET /api/users',
			findOne : 'GET /api/users/{id}',
			create  : 'POST /api/users',
			update  : 'PUT /api/users/{id}',
			
		}, {
			fromSession: function() {
				var self = this;
				can.ajax({
					url: '/api/auth/session',
					type: 'GET'
				}).done(function(data) {
					//self.attr(can.Model.model(data).attr());
					self.attr( self.cleanupData(data) );
					self.attr('loggedIn', true);
				}).fail(function(response) {
					self.attr('loggedIn', false);
					console.error(response);
				});
			},

			cleanupData: function( data ) {
				for( var key in data ) {
					if( data[key] === 'null' || data[key] === 'undefined' ) {
						data[key] = '';
					}
				}
				return data;
			},

			isAdmin: function() {
				return _.include(this.attr('roles'), 'admin');
			},

			loggedIn: function() {
				return this.attr('loggedIn');
			},

			login: function(provider) {
				auth.login.apply(this, [ providers[provider] ]);
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

			logout: function() {
				var self = this,
					blacklist = ['loggedInDelayed'];

				$.get('/api/auth/logout', function () {
					// remove attrs from current user
					setTimeout(function() { self.attr('loggedInDelayed', false) }, 500);
					for(var key in self.attr()) {
						if (blacklist.indexOf(key) < 0) self.removeAttr(key);
					}
				});
			}
		});

		return User;
	}
);
