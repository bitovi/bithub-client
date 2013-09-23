steal('bithub/navigator/profile_navbar','funcunit', function( ProfileNavbar, S ) {

	module("bithub/navigator/profile_navbar", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='profile_navbar'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new ProfileNavbar('#profile_navbar');
		ok( $('#profile_navbar').html() , "updated html" );
	});

});