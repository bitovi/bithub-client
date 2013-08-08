steal('bithub/homepage/sidebar','funcunit', function( Sidebar, S ) {

	module("bithub/homepage/sidebar", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='sidebar'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Sidebar('#sidebar');
		ok( $('#sidebar').html() , "updated html" );
	});

});
