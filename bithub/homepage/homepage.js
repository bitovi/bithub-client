steal(
	'can',
	'./init.mustache',
	'bithub/events',
	'bithub/leaderboard',
	function(can, initView, Events, Leaderboard) {
		return can.Control({
			defaults : {}
		}, {
			init : function( elem, opts ){
				var self = this;
				
				elem.html( initView({
				}, {
					ifLoggedin: function (opts) {
						return (self.options.currentUser.attr('loggedIn')) ? opts.fn( this ) : opts.inverse( this );
					}
				}) );
				
				new Events( elem.find('#events'), opts );
				new Leaderboard( elem.find('#leaderboard'), opts );
			}
		});
	});
