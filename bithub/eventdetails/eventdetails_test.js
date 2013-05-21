steal('bithub/eventdetails','funcunit', function( Eventdetails, S ) {

	module("bithub/eventdetails", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='eventdetails'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Eventdetails('#eventdetails');
		ok( $('#eventdetails').html() , "updated html" );
	});

});