steal('ui/radioselector','funcunit', function( RadioSelector, S ) {

	module("ui/radioselector", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='radioselector'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new RadioSelector('#radioselector');
		ok( $('#radioselector').html() , "updated html" );
	});

});
