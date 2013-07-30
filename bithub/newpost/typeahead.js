steal('bithub/models/postas_user.js', function(PostasUser){
	return function(self){

		function itemIsPartOfQueryString(query, item) {
			return (item && item.toLowerCase().indexOf(query.trim().toLowerCase()) > -1)
		}

		var users;

		return function(){
			return function(elem){
				var el = $(elem);
				el.typeahead({
					minLength: 3,
					source: function(query, process) {
						var feed     = self.element.find('input[name=postas_feed]:checked').val();
						clearTimeout(this.timeout);
						this.timeout = setTimeout(function () {					
							PostasUser.findAll({user : query, feed: feed}).then(function(list){
								users = list;
								process(can.map(list, function(user){
									return user.fullName();
								}))
							});
						}, 200);
					},
					matcher: function(item) {
						return itemIsPartOfQueryString(this.query, item);
					},
					updater: function (item) {
						var key = item.split('/')[0];

						selectedUser = can.grep(users, function(user){
							return user.id === key;
						})[0];

						var	feed = self.element.find('input[name=postas_feed]:checked').val();
						if (feed == 'twitter') {
							self.element.find('input.postas_id').val(selectedUser.id); 
							self.element.find('img.postas.avatar').attr('src', selectedUser.profile_image_url);
						} else if (feed == 'github') {
							self.element.find('input.postas_id').val(selectedUser.id.replace('user-', '')); 
							self.element.find('img.postas.avatar').attr('src', 'https://www.gravatar.com/avatar/' + selectedUser.gravatar_id + '?s=48'); 
						}
						self.element.find('input.postas_feed').val(feed); 
						return item;
					}
				});
			}
		}
	}
})