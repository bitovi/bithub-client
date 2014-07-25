steal(
	'can/model',
	'can/map/delegate',
	'can/map/attributes',
	'vendor/lodash',
	function (Model) {

		var providers = {
			twitter: { url: '/api/auth/twitter' },
			github: { url: '/api/auth/github' },
			meetup: { url: '/api/auth/meetup' },
			stackexchange: { url: '/api/auth/stackexchange' }
		};

		return Model.extend({

			findAll : 'GET  /api/v2/users',
			findOne : 'GET  /api/v2/users/{id}',
			update  : 'PUT  /api/v2/users/{id}',
			destroy  : 'DELETE  /api/v2/users/{id}',
			attributes : {
				
			}
		}, {
			serialize : function(){
				var data = this._super();
				delete data.achievements;
				delete data.identities;
				delete data.activites;
				return data;
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

			loadActivities : function(){
				var self = this;
				Bithub.Models.Activity.findAll({userId: this.attr('id'), limit: 100000}, function(activities){
					self.attr('activities', self.attr('activities') || []);
					self.attr('activities').replace(activities);
				})
			},
			avatarUrl : function(){
				var defaultAvatar = '/assets/images/icon-user.png',
					currentAvatar = this.attr('avatar_url') || defaultAvatar,
					identities, sourceData;
				if(currentAvatar === defaultAvatar){
					identities = this.attr('identities') || [];
					for(var i = 0; i < identities.length; i++){
						sourceData = identities[i].source_data || {};
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
			},
			rolesCsv : function(){
				return (this.attr('roles') || []).join(', ')
			}

		});

	}
);
