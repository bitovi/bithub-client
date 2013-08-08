steal('bithub/event_list','funcunit', function( EventList, S ) {

	module("bithub/event_list", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='event-list'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Events('#event-list');
		ok( $('#event-list').html() , "updated html" );
	});

});
