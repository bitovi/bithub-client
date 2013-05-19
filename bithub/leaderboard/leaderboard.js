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

					  this.topUsers = new Bithub.Models.User.List();
					  this.nearestUsers = new Bithub.Models.User.List();

					  this.element.html( initView( {
						  topUsers: self.topUsers,
						  nearestUsers: self.nearestUsers,
						  currentUser: self.options.currentUser
					  }, {
						  isLoggedin: function (opts) {
							  return (this.attr('loggedIn')) ? 'active' : '';
						  }
					  }) );

					  this.updateLeaderboard();
				  },

				  // find the better way ...
				  '{currentUser} change': function( user, ev, attr, how, newVal, oldVal ) {
					  var self = this;

					  if (attr === 'loggedIn' && newVal === true) {
						  if ( user.attr('rank') > defaultParams.limit ) {
							  User.findAll( can.extend({}, defaultParams, {offset: user.attr('rank') -3, limit: 6}), function( data ) {
								  self.nearestUsers.replace( data );
							  } );
						  }

						  /*
						  this.topUsers.each(function (user) {
							  if (self.options.currentUser.attr('id') === user.attr('id')) {
								  user.attr('loggedIn', true);
							  }
						  });
						   */
					  }
				  },
				  //

				  updateLeaderboard: function( params ) {
					  var self = this;

					  User.findAll( defaultParams, function ( data ) {
						  self.topUsers.replace( data );
					  });
				  }

			  });
	  });
