steal('bithub/admin/users/form','funcunit', function( Form, S ) {

	module("bithub/admin/users/form", { 
		setup: function(){
			S.open( window );
			$("#qunit-test-area").html("<div id='form'></div>")
		},
		teardown: function(){
			$("#qunit-test-area").empty();
		}
	});
	
	test("updates the element's html", function(){
		new Form('#form');
		ok( $('#form').html() , "updated html" );
	});

});