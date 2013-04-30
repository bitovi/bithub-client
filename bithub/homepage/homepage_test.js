steal('bithub/homepage','funcunit', function( Homepage, S ) {

	module("bithub/homepage", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='homepage'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Homepage('#homepage');
		ok( $('#homepage').html() , "updated html" );
	});

});