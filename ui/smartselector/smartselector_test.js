steal('ui/smartselector','funcunit', function( Smartselector, S ) {

	module("ui/smartselector", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='smartselector'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Smartselector('#smartselector');
		ok( $('#smartselector').html() , "updated html" );
	});

});