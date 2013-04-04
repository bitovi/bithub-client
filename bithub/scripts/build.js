//js bithub2/scripts/build.js

load("steal/rhino/rhino.js");
steal('steal/build',function(){
	steal.build('bithub2/scripts/build.html',{to: 'bithub2'});
});
