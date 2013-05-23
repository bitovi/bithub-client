steal('bithub/modals','funcunit', function( Modals, S ) {

	module("bithub/modals", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='modals'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Modals('#modals');
		ok( $('#modals').html() , "updated html" );
	});

});