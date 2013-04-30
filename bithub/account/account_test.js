steal('bithub/profile/account','funcunit', function( Account, S ) {

	module("bithub/profile/account", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='account'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Account('#account');
		ok( $('#account').html() , "updated html" );
	});

});