steal('bithub/profile/swag','funcunit', function( Swag, S ) {

	module("bithub/profile/swag", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='swag'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Swag('#swag');
		ok( $('#swag').html() , "updated html" );
	});

});