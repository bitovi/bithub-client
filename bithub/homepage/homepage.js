steal(
	'can',
	'bithub/homepage/homepage.ejs',
	'bithub/homepage/event_list',
	'bithub/homepage/event_details',
	'bithub/homepage/rewards',
	'bithub/homepage/sidebar',
	'bithub/helpers/fun_helpers.js',
	function(can, homepageView, EventList, EventDetails, Rewards, Sidebar, f) {

		var defined = _.compose(_.isUndefined, f.complement);

		var pickControl = function (currentView) {
			if (currentView === 'details') return EventDetails
			else if (currentView === 'rewards') return Rewards
			return EventList;
		}

		var switchingControls = function (newView, oldView) {
			return (pickControl(newView) !== pickControl(oldView));
		}

		var currentControl;
		
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
					opts.currentUser._triggerChange('isLoggedIn', 'change', isLoggedIn, isLoggedIn);
				}
			},

			'{can.route} view' : function (route, ev, newVal, oldVal) {
				this.initControl(newVal);
			},

			'{can.route} page': function(route, ev, newVal, oldVal) {
				if (newVal != ' homepage') currentControl = null;
			},

			initControl : function (newView) {
				var mainControl = pickControl(newView);

				if( currentControl == mainControl ) {
					return;
				} else {
					currentControl = mainControl;
				}
				
				var $div = $('<div/>').addClass('clean'),
					$mainContainer = this.element.find('#main-container').html($div)

				new mainControl(this.element.find('#main-container > div'), this.options);
			}

		});
	}
);
