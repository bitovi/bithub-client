steal(
	'can',
	'can/construct/super',
	function (can) {
		var PostasUser = can.Model('Bithub.Models.PostasUser', {
			findAll : 'GET /api/users/{feed}',
			models : function(data){
				for(var i = 0; i < data.length; i++){
					data[i].id   = data[i].screen_name || data[i].username;
					data[i]['type'] = data[i].screen_name ? 'twitter' : 'github';
				}
				return this._super(data);
			}
		}, {
			fullName : function(){
				return [this.id, this.name].join('/')
			}
		});
		
		return PostasUser;
	});