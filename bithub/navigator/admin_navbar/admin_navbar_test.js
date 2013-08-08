steal('bithub/navigator/admin_navbar','funcunit', function( AdminPanel, S ) {

	module("bithub/navigator/admin_navbar", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='admin_navbar'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new AdminPanel('#admin_navbar');
		ok( $('#admin_navbar').html() , "updated html" );
	});

});
