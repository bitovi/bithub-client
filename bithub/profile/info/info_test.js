steal('bithub/profile/info','funcunit', function( Info, S ) {

	module("bithub/profile/info", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='info'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Info('#info');
		ok( $('#info').html() , "updated html" );
	});

});