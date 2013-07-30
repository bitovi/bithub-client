steal('bithub/models/postas_user.js', function(PostasUser){
	return function(controllerElem){

		var users;
		return function(){ // helper
			return function(elem){
				var el = $(elem);
				el.typeahead({
					minLength: 3,
					source: function(query, process) {
						var feed = controllerElem.find('input[name=postas_feed]:checked').val();
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
						return (item && item.toLowerCase().indexOf(this.query.trim().toLowerCase()) > -1)
					},
					updater: function (item) {
						var key = item.split('/')[0].trim();
						selectedUser = can.grep(users, function(user){
							return user.username === key;
						})[0];

						controllerElem.find('input.postas_id').val(selectedUser.id); 
						controllerElem.find('img.postas.avatar').attr('src', selectedUser.profileImageUrl());
						controllerElem.find('input.postas_feed').val(selectedUser.from);
						return item;
					}
				});
			}
		}
	}
})
