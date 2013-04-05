steal('ui/dropdownselector','funcunit', function( Dropdownselector, S ) {

	module("ui/dropdownselector", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='dropdownselector'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Dropdownselector('#dropdownselector');
		ok( $('#dropdownselector').html() , "updated html" );
	});

});