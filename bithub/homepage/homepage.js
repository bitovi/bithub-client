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
				elem.html( initView({}) );
				
				new Events( elem.find('#events') );
				new Leaderboard( elem.find('#leaderboard'), {
					currentUser: opts.currentUser
				});
			}
		});
	});
