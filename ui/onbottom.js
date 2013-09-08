steal(
	'can',
	function () {
		return can.Control('UI.Onbottom', {
			defaults: { 
				treshold: 50,
				onbottom: false
			}
		}, {
			init: function(element, options) {
			},

			'scroll': "trigger",
			'{window} resize': "trigger",

			trigger: function (element) {
				var self = this,
					verticalPositon = self.options.verticalPositon;

				verticalPositon = self.element.height() - self.element.scrollTop() - self.options.treshold;
				if (( verticalPositon <= window.innerHeight) && self.options.onbottom == false) {
					self.options.onbottom = true;
					self.element.trigger('onbottom');
				};
				if (( verticalPositon > window.innerHeight) && self.options.onbottom == true) {
					self.options.onbottom = false;
				};
			}
			
		});
	});
