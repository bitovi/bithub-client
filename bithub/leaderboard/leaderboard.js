steal('can',
	  './init.mustache',
	  'bithub/models/users.js',	  
	  function(can, initView, Users){
    /**
     * @class bithub/leaderboard
	 * @alias Leaderboard   
     */
    return can.Control(
	/** @Static */
	{
		defaults : {}
	},
	/** @Prototype */
	{
		init : function(){
			var self = this;
			
			Users.leaderboard({},
							  function(data) {
								  can.each(data, function (user, index) {
									  user.attr('no', index + 1);
								  });
								  self.element.html(initView({ users: data }));
							  },
							  function(err) {
								  console.log("Error HTTP status: " + err.status);
								  // init view with error message?
							  });
			
		}
	});
});
