steal('bithub/profile/activities','funcunit', function( Activities, S ) {

	module("bithub/profile/activities", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='activities'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Activities('#activities');
		ok( $('#activities').html() , "updated html" );
	});

});