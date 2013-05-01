//js bithub/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs", function(DocumentJS){
	DocumentJS('bithub/index.html', {
		markdown : ['bithub', 'steal', 'jquery', 'can', 'funcunit']
	});
});
