steal('can',
	  './init.mustache',
	  'bithub/models/user.js',
	  function(can, initView, Users){
		  /**
		   * @class bithub/leaderboard
		   * @alias Leaderboard
		   */
		  return can.Control(
			  /** @Static */
			  {
				  defaults : {
					  // currentUser: new can.Observe({id: 0}) //tmp
				  }
			  },
			  /** @Prototype */
			  {
				  init : function(){
					  var self = this;

					  Users.findAll({order: 'score:desc', limit: 6},
									function(data) {
										self.options.users = data;
										
										can.each(data, function (user, index) {
											user.attr('no', index + 1);

											// check if user is already loggedin
											user.attr('loggedin', (self.options.currentUser.attr('id') === user.attr('id')) ? true : false);
										});
										self.element.html(initView({ users: data }));
									},
									function(err) {
										console.log("Error HTTP status: " + err.status);
										// init view with error message?
									});
				  },
				  
				  '{currentUser} loggedin': function (currentUser, ev, attr, method, newVal) {
					  var self = this;

					  can.each(self.options.users, function(user, index) {
						  if (self.options.currentUser.attr('id') === user.attr('id')) {
							  user.attr('loggedin', true);
						  }
					  });
					  
				  }
			  });
	  });
