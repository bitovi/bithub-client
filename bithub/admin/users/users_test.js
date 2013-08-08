steal('bithub/admin/users','funcunit', function( Users, S ) {

	module("bithub/admin/users", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='users'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Users('#users');
		ok( $('#users').html() , "updated html" );
	});

});