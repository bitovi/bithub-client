steal('navigator','funcunit', function( Navigator, S ) {

	module("navigator", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='navigator'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Navigator('#navigator');
		ok( $('#navigator').html() , "updated html" );
	});

});
