steal('ui/categories','funcunit', function( Categories, S ) {

	module("ui/categories", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='categories'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Categories('#categories');
		ok( $('#categories').html() , "updated html" );
	});

});