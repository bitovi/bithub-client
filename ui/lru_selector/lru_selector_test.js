steal('ui/lruselector','funcunit', function( LRUSelector, S ) {

	module("ui/lruselector", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='lruselector'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new LRUSelector('#lruselector');
		ok( $('#lruselector').html() , "updated html" );
	});

});
