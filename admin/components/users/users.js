steal(
'can/util/string',
'can/component',
'./users.mustache',
'admin/models/user.js',
'./users.less',
'admin/components/user_details',
'admin/components/pagination',
function(can, Component, usersView, UserModel){

	return can.Component({
		tag : 'users',
		template : usersView,
		scope: {
			users : [],
			params : {

			},
			init : function(){
				this.updateParams()

				this.loadUsers();
			},
			updateParams : function(){
				var currentPage = (can.route.attr('currentPage') || 1);

				this.attr('params', {
					limit : 50,
					offset : (currentPage - 1) * 50
				})
			},
			loadUsers : function(){
				var self = this;

				this.attr('loading', true);
				UserModel.findAll(this.attr('params').serialize()).then(function(data){
					can.batch.start();
					self.attr('users').replace(data);
					self.attr('loading', false);
					self.attr('count', data.count);
					can.batch.stop();

				})
			}
		},
		events : {
			"{can.route} currentPage" : function(){
				this.scope.updateParams();
				this.scope.loadUsers();
			}
		}
	})

});