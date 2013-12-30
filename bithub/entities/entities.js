steal.apply(steal, (function(){
	var files = ['chat', 'code', 'default', 'digest-list', 'event', 'issue', 'push', 'twitter'];
	for(var i = 0; i < files.length; i++){
		files[i] = './' + files[i] + '/' + files[i] + '.js';
	}
	return files;
})())