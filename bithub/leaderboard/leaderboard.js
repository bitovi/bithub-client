steal('can',
	  './init.mustache',
	  'bithub/models/user.js',
	  'can/observe/delegate',
	  'bithub/helpers/mustacheHelpers.js',
	  function(can, initView, User){
		  /**
		   * @class bithub/leaderboard
		   * @alias Leaderboard
		   */

		  var defaultParams = {
			  cached: true
			  //order: 'score:desc',
			  //limit: 6
		  };

		  var rank = can.compute( function( newVal ) {
			  var current = 0;
			  if (newVal) { current = newVal; }
			  return current;
		  });

		  var breakAt = can.compute( function() {
			  return (rank() > 7) ? rank()-1 : 0;
		  });
		  
		  var topLength = can.compute( function() {
			  if (rank() < 6) {
				  return 6;
			  } else if (rank() < 8) {
				  return rank();
			  } else {
				  return 5;
			  }
		  });
		  
		  return can.Control(
			  /** @Static */
			  {
				  defaults : {
					  users: new Bithub.Models.User.List()
				  }
			  },
			  /** @Prototype */
			  {
				  init : function( elem, opts ) {
					  var self = this;

					  this.element.html( initView( {
						  users: this.options.users,
						  currentUser: this.options.currentUser,
						  breakAt: breakAt,
						  topLength: topLength
					  }, {
						  isLoggedin: function (opts) {
							  return (this.attr('loggedIn')) ? 'active' : '';
						  }
					  }) );

					  this.updateLeaderboard();
				  },

				  '{currentUser} loggedIn change': function( ) {
					  this.determineRank();
				  },

				  '{users} length': function () {
					  this.determineRank();
				  },

				  determineRank: function () {
					  var self = this;
					  
					  this.options.users.each(function (user, i) {							  
						  if (self.options.currentUser.attr('id') === user.attr('id')) {
							  user.attr('loggedIn', true);
							  rank( i );
						  }
					  });
				  },

				  updateLeaderboard: function( params ) {
					  var self = this;

					  User.findAll( defaultParams, function ( data ) {
						  self.options.users.replace( data );
					  });
				  }

			  });
	  });
