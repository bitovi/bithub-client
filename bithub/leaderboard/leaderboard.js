steal('can',
	  './init.mustache',
	  'bithub/models/user.js',
	  function(can, initView, User){
		  /**
		   * @class bithub/leaderboard
		   * @alias Leaderboard
		   */

		  var defaultParams = {
			  order: 'score:desc',
			  limit: 6
		  };

		  return can.Control(
			  /** @Static */
			  {
				  defaults : {}
			  },
			  /** @Prototype */
			  {
				  init : function() {
					  var self = this;

					  this.users = new Bithub.Models.User.List();

					  this.element.html( initView( {
						  users: self.users
					  }, {
						  enumerate: function (data, opts) {
							  return data.map( function(item, index) {
								  item.attr('index', index+1);
								  return opts.fn(item);
							  }).join('');
						  },
						  isLoggedin: function (opts) {
							  return (this.attr('loggedIn')) ? 'active' : '';
						  }
					  }) );

					  this.updateLeaderboard();
				  },

				  // find the better way ...
				  '{currentUser} loggedin': function (currentUser) {
					  this.users.each(function (user) {
						  if (currentUser.attr('id') === user.attr('id')) {
							  user.attr('loggedIn', true);
						  }
					  });
				  },
				  //

				  updateLeaderboard: function( params ) {
					  var self = this;

					  User.findAll( defaultParams, function ( data ) {
						  self.users.replace( data );
					  });
				  }

			  });
	  });
