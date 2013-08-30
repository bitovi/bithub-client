steal('ui/html_select','funcunit', function( HtmlSelect, S ) {

	module("ui/html_select", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='html_select'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new HtmlSelect('#html_select');
		ok( $('#html_select').html() , "updated html" );
	});

});