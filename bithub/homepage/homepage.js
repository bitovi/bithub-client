steal(
	'can',
	'bithub/homepage/homepage.ejs',
	'bithub/homepage/event_list',
	'bithub/homepage/event_details',
	'bithub/homepage/sidebar',
	'bithub/helpers/fun_helpers.js',
	function(can, homepageView, EventList, EventDetails, Sidebar, f) {

		var defined = _.compose(_.isUndefined, f.complement);

		var pickControl = function (currentView) {
			if (currentView === 'details') return EventDetails;
			return EventList;
		}

		var switchingControls = function (newView, oldView) {
			return (pickControl(newView) !== pickControl(oldView));
		}

		return can.Control.extend({
			pluginName: 'homepage',
			defaults : {
				buffers: { }
			}
		}, {
			init : function( elem, opts ){
				this.element.html(homepageView());
				this.initControl(can.route.attr('view'));
				new Sidebar(elem.find('#sidebar-container'), this.options);

				// sometimes responses from /auth/session comes before this control is initialized
				var isLoggedIn = opts.currentUser.attr('isLoggedIn');
				if (defined(isLoggedIn)) {
					opts.currentUser._triggerChange('isLoggedIn', 'change', loggedIn, loggedIn);
				}
			},

			'{can.route} view' : function (route, ev, newVal, oldVal) {
				// this.options.buffers[oldVal] = this.element.find("#main-container > div").detach();

				// console.log(this.options.buffers);
				// if (this.options.buffers[newVal]) {
				// 	this.element.find('#main-container > div')
				// 		.removeClass('clean')
				// 		.addClass('buffered')
				// 		.html(this.options.buffers[newVal]);
				// } else if (switchingControls(newVal, oldVal)) {
				// 	this.initView(newVal)
				// }
				
				if (switchingControls(newVal, oldVal)) {
					this.initControl(newVal)
				}
				
			},

			initControl : function (newView) {
				var mainControl = pickControl(newView),
					$div = $('<div/>').addClass('clean'),
					$mainContainer = this.element.find('#main-container').html($div)

				new mainControl(this.element.find('#main-container > div'), this.options);
			}

		});
	}
);
