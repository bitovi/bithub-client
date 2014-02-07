steal(
	'can',
	'can/construct/super',
	function (can) {
		var PostasUser = can.Model('Bithub.Models.PostasUser', {
			findAll : 'GET /api/v1/users/{feed}',
			model : function(data){
				data.from = data.screen_name ? 'twitter' : 'github';
				data.username = data.screen_name || data.username;
				data.id = (data.from == 'github') ? parseInt(data.id.replace('user-', ''), 10) : data.id; 
				return this._super(data);
			}
		}, {
			fullName : function() {
				return [this.username, this.name].join(' / ');
			},
			profileImageUrl: function() {
				var githubUrl = function (gravatarId) { return 'https://www.gravatar.com/avatar/' + gravatarId + '?s=48' };
				return (this.from === 'github') ? githubUrl(this.gravatar_id) : this.profile_image_url;
			}
		});
		return PostasUser;
	});
