var utils = require('utils');
var casper = require('casper').create({
		verbose: false,
		logLevel: "debug",
		pageSettings:{
				javascriptEnabled: true,
				loadImages : true
		}
});

var factor = 1;
var COMPONENT = casper.cli.args[0];
var TAG_NAME  = COMPONENT.replace(/_/g, '-');

var makeScreenshot = function(state){
	var bounds = this.getElementBounds(TAG_NAME);

	this.capture('demo/screenshots/' + COMPONENT + '_' + state + '.png', {
		top: bounds.top * factor,
		left: bounds.left * factor,
		width: bounds.width * factor,
		height: bounds.height * factor
	})
}

casper.start('http://localhost:9001/components/' + COMPONENT + '/' + COMPONENT + '.html', function(){
	factor = this.evaluate(function(){
		return window.devicePixelRatio || 1;
	})
	this.zoom(factor);
	this.viewport(1280 * factor, 1000 * factor);
});

casper.on('remote.message', function(msg) {
	this.echo('from within remote page DOM' + msg);
}); 

casper.waitForSelector(TAG_NAME, function(){
	var self = this;
	var states = this.evaluate(function(){
		var componentStates = window.STATES || {},
				keys = [];
		for(var k in componentStates){
			if(componentStates.hasOwnProperty(k)){
				keys.push(k)
			}
		}
		return keys;
	})

	makeScreenshot.call(this, 'default');

	for(var i = 0; i < states.length; i++){
		(function(s){
			self.evaluate(function(fn){
				window.STATES[fn]();
			}, s);
			self.wait(1, function(){
				makeScreenshot.call(casper, s);
			});
		})(states[i])
		
	}

}, function(){
	this.echo("Selector '" + TAG_NAME + "' doesn't exist on the page")
}, 10000);

casper.run();