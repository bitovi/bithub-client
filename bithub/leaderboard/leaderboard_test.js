steal('bithub/leaderboard','funcunit', function( Leaderboard, S ) {

	module("bithub/leaderboard", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='leaderboard'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Leaderboard('#leaderboard');
		ok( $('#leaderboard').html() , "updated html" );
	});

});