steal('bithub/events','funcunit', function( Events, S ) {

	module("bithub/events", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='events'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Events('#events');
		ok( $('#events').html() , "updated html" );
	});

});