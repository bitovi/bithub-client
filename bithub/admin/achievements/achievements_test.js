steal('bithub/admin/achievements','funcunit', function( Achievements, S ) {

	module("bithub/admin/achievements", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='achievements'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Achievements('#achievements');
		ok( $('#achievements').html() , "updated html" );
	});

});