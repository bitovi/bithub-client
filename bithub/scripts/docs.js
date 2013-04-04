//js bithub2/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs", function(DocumentJS){
	DocumentJS('bithub2/index.html', {
		markdown : ['bithub2', 'steal', 'jquery', 'can', 'funcunit']
	});
});