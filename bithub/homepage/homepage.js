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
				
				new Events( elem.find('#events'), opts );
				new Leaderboard( elem.find('#leaderboard'), opts );
			}
		});
	});
