steal('bithub/profile','funcunit', function( Profile, S ) {

	module("bithub/profile", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='profile'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Profile('#profile');
		ok( $('#profile').html() , "updated html" );
	});

});