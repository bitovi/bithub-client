steal('bithub/homepage/event_details','funcunit', function( EventDetails, S ) {

	module("bithub/homepage/event_details", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='eventdetails'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new EventDetails('#event-details');
		ok( $('#event-details').html() , "updated html" );
	});

});
