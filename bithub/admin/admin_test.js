steal('bithub/admin','funcunit', function( Admin, S ) {

	module("bithub/admin", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='admin'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Admin('#admin');
		ok( $('#admin').html() , "updated html" );
	});

});