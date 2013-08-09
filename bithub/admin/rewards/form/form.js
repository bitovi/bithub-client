steal(
	'can',
	'./form.mustache',
	'bithub/models/reward.js',
	'vendor/fileupload',
	'jquerypp/dom/form_params',
	function(can, rewardFromView, Reward, fileUpload){
		return can.Control.extend({
			defaults : { 'Reward': Reward }
		}, {
			init : function(element, opts){
				element.html(rewardFromView({reward: opts.reward}));

				var self = this;
				element.fileupload({
					url: '/api/rewards',
					datatype: 'json',
					limitMultiFileUploads: 1,
					replaceFileInput: false,
					acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
					add: function(el, data) {
						self.options.fileData = data;
					}
				});
			},

			' fileuploaddone' : function( el, ev, data ) {
				can.route.attr({page: 'admin', view: 'rewards', action: 'list'})
			},

			' submit' : function(el, ev) {
				ev.preventDefault();
				if (this.options.fileData) {
					this.options.fileData.submit();
				} else {
					var reward = this.options.reward.attr(this.element.formParams());
					reward.save();
				}
			},

			'{Reward} created' : function(el, ev) {
				can.route.attr({ page: 'admin', view: 'rewards', action: 'list' });
			},

			'{Reward} updated' : function(el, ev) {
				can.route.attr({ page: 'admin', view: 'rewards', action: 'list' });
			}
		});
	}
);
