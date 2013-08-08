steal('bithub/flagsnapper','funcunit', function( Flagsnapper, S ) {

	module("bithub/flagsnapper", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='flagsnapper'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Flagsnapper('#flagsnapper');
		ok( $('#flagsnapper').html() , "updated html" );
	});

});