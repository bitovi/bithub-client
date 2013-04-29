steal('bithub/pageswitcher','funcunit', function( Pageswitcher, S ) {

	module("bithub/pageswitcher", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='pageswitcher'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Pageswitcher('#pageswitcher');
		ok( $('#pageswitcher').html() , "updated html" );
	});

});