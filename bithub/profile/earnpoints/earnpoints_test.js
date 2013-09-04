steal('bithub/earnpoints','funcunit', function( Earnpoints, S ) {

	module("bithub/earnpoints", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='earnpoints'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Earnpoints('#earnpoints');
		ok( $('#earnpoints').html() , "updated html" );
	});

});