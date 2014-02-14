steal(
	'can',
	'./init.mustache',
	'bithub/profile/info',
	'bithub/profile/activities',
	function(can, initView, ProfileInfoControl, ProfileActivitiesControl){

		var currentControl;
		
		return can.Control.extend({
			pluginName: 'profile',
			defaults : {
				views: {
					info: ProfileInfoControl,
					activities: ProfileActivitiesControl
				}
			}
		}, {
			init : function (elem, opts) {
				var currentUser
				this.initControl(can.route.attr('view'), opts);
				this.reloadUser();
			},

			'{can.route} view' : function (fn, ev, newVal, oldVal) {
				this.initControl(newVal);
			},

			'{can.route} page': function(route, ev, newVal, oldVal) {
				if (newVal != ' profile') currentControl = null;
			},
			
			'{currentUser} loggedIn' : function (fn, ev, newVal, oldVal) {
				if (newVal == false) can.route.attr({'page': 'homepage', 'view': 'latest'});
			},

			reloadUser : function(){
				var currentUser = this.options.currentUser,
					self = this;
				if(currentUser.isLoggedIn()){
					this.__currentReq = currentUser.constructor.findOne({id: currentUser.id}, function(){
						delete self.__currentReq;
						self.__refreshTimeout = setTimeout(self.proxy('reloadUser'), 60 * 1000);
					});
				} else {
					self.__refreshTimeout = setTimeout(self.proxy('reloadUser'), 60 * 1000);
				}
			},

			initControl : function (currentView) {
				var control = this.options.views[currentView];

				if( currentControl == control ) {
					return;
				} else {
					currentControl = control;
				}

				var	$div = $('<div/>');

				new control($div, this.options);
				this.element.html($div);
			},

			destroy : function(){
				this._super();
				this.__currentReq && this.__currentReq.abort();
				clearTimeout(this.__refreshTimeout);
			}
			
		});
	}
);
