//js bithub/scripts/build.js

load("steal/rhino/rhino.js");
steal('steal/build',function(){
	steal.build('bithub/scripts/build.html',{to: 'bithub'});
});
