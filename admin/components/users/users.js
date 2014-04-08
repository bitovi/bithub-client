steal(
'can/util/string',
'can/component',
'./users.mustache',
'./users.less',
'admin/components/user_details',
function(can, Component, usersView){

	var users = [];

	for(var i = 0; i < 25; i++){
		users.push(i)
	}

	return can.Component({
		tag : 'users',
		template : usersView,
		scope: {
			users : new can.List(users),
			userDetails : false,
			showDetails : function(){
				this.attr('userDetails', true);
			},
			showList : function(){
				this.attr('userDetails', false);
			}
		}
	})

});