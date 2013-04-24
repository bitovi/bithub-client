steal('bithub/newpost','funcunit', function( Newpost, S ) {

	module("bithub/newpost", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='newpost'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Newpost('#newpost');
		ok( $('#newpost').html() , "updated html" );
	});

});