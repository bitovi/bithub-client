steal(
'can/util/string',
'can/component',
'./users.mustache',
'admin/models/user.js',
'./users.less',
'admin/components/user_details',
function(can, Component, usersView, UserModel){

	return can.Component({
		tag : 'users',
		template : usersView,
		scope: {
			users : [],
			init : function(){
				this.loadUsers();
			},
			loadUsers : function(){
				var self = this;

				this.attr('loading', true);
				UserModel.findAll({}).then(function(data){
					can.batch.start();
					self.attr('users').replace(data);
					self.attr('loading', false);
					can.batch.stop();

				})
			}
		}
	})

});