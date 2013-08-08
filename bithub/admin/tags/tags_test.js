steal('bithub/admin/tags','funcunit', function( Tags, S ) {

	module("bithub/admin/tags", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='tags'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Tags('#tags');
		ok( $('#tags').html() , "updated html" );
	});

});