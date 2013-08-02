steal('ui/optionselector','funcunit', function( Optionselector, S ) {

	module("ui/optionselector", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='optionselector'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Optionselector('#optionselector');
		ok( $('#optionselector').html() , "updated html" );
	});

});