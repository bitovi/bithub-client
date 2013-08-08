steal('bithub/navigator/filterbar','funcunit', function( Filterbar, S ) {

	module("bithub/navigator/filterbar", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='filterbar'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Filterbar('#filterbar');
		ok( $('#filterbar').html() , "updated html" );
	});

});