steal('ui/bootstrap_dropdown','funcunit', function( BootstrapDropdown, S ) {

	module("ui/bootstrap_dropdown", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='bootstrap_dropdown'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new BootstrapDropdown('#bootstrap_dropdown');
		ok( $('#bootstrap_dropdown').html() , "updated html" );
	});

});