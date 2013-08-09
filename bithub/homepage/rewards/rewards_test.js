steal('bithub/rewards','funcunit', function( Rewards, S ) {

	module("bithub/rewards", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='rewards'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Rewards('#rewards');
		ok( $('#rewards').html() , "updated html" );
	});

});