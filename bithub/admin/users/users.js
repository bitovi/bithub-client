steal(
	'can',
	'./users.ejs',
	'bithub/models/user.js',
	'./form/form.js',
	'../paginator.js',
	function(can, usersListView, User, userFormControl, Paginator) {
		
		var isFormAction = function (route) {
			return route==='edit' || route==='new';
		}
		
		var paginator;
		return can.Control.extend({
			pluginName: 'admin-users',
			defaults : { }
		}, {
			init : function(element, opts){
				paginator = new Paginator(can.route.attr('offset'));
				if (isFormAction(can.route.attr('action'))) {
					this.loadForm();
				} else {
					this.loadList();
				}
			},

			loadForm: function () {
				var self = this;
				if (can.route.attr('id')) {
					User.findOne({id: can.route.attr('id')}, function(user) {
						new userFormControl(self.element, {user: user});
					});
				} else  {
					new userFormControl(self.element, {user: new User()});
				}
			},

			loadList: function () {
				var self = this;
				User.findAll(paginator.currentState(), function(users) {
					self.element && self.element.html(usersListView({
						users: users,
						prevOffset: paginator.prevOffset(),
						nextOffset: paginator.nextOffset()
					}));
				});
			},
			
			'{can.route} offset': function(j, d, newVal, oldVal) {
				paginator.updateOffset(newVal);
				this.loadList();
			},

			'{can.route} action': function (route, ev, newVal, oldVal) {
				if (isFormAction(newVal)) {
					this.loadForm();
				} else {
					this.loadList();
				}
			}
		});
	}
);
