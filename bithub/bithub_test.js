steal(
	'funcunit',
	function (S) {

	// this tests the assembly 
	module("bithub2", {
		setup : function () {
			S.open("//bithub2/index.html");
		}
	});

	test("welcome test", function () {
		equals(S("h1").text(), "Welcome to JavaScriptMVC!", "welcome text");
	});

});
