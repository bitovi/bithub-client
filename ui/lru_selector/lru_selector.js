steal(
	'can',
	'./init.ejs',
	'jquerypp/dom/cookie',
	'can/observe/delegate',
	function(can, initView){
		var items = new can.Observe.List();
		
		var currentViewFiltered = function () {
			var currentPage = can.route.attr('page'),
				currentView = can.route.attr('view');

			if (currentPage === 'homepage' || currentPage === 'admin')
				return currentView;
			else
				return 'latest';
		};

		var smartSelectorItemRoute = function (item) {
			return can.route.url({
				category: item.name,
				project: can.route.attr('project') || 'all',
				view: currentViewFiltered()
			}, false);
		};

		return can.Control.extend({
			defaults : {
				orderingCookieName: 'smartFilterItemsOrdering',
				breakIdx: 3,
				defaultOption: {
					name: 'all',
					display_name: 'All'
				}
			}
		}, {
			init : function( elem, opts ){
				var self = this;
				self.options.defaultOption = new can.Observe(self.options.defaultOption);
				self.element.html( initView( {
					htmlId: self.options.htmlId,
					defaultOption: self.options.defaultOption,
					items: items,
					breakIdx: self.options.breakIdx
				}, {
					isSelected: function( item ) {
						var name = (typeof(item) === 'function') ? item() : item.name;
						return (self.options.state() === name) ? 'active' : '';
					},
					itemUrl: function (item) {
						return smartSelectorItemRoute(item);
					}
				}));
			},

			"{can.route} change": function(el, ev, attr, how, newVal, oldVal) {
				if (attr === "category" && (how === 'set' || how === 'add')) {
					if (items.length > 0) {
						var selectedItem;

						// find selected item
						can.each(items, function(item) {
							if (item.name == newVal) selectedItem = item;
						})

						// .. if item is from dropdown do LRU
						if( items.indexOf(selectedItem) >= this.options.breakIdx ) {

							// push item to the head
							items.splice(items.indexOf(selectedItem), 1);
							items.unshift(selectedItem);
							// sort the rest and save to cookie
							this.sortItems(); 
							this.saveOrderingToCookie();
						}
					}
				}
			},

			"{categories} change": function() {
				this.options.categories.forEach( function( item ) {
					items.push({name: item.name, display_name: item.display_name });
				});
				this.loadOrderingFromCookie();
				this.sortItems();
			},

			sortItems: function() {
				var idx = this.options.breakIdx,
				length = items.length;

				items.replace( items.concat(items.splice(idx, length-idx).sort( function( a, b ) {
					return a.name > b.name;
				})) );
			},

			saveOrderingToCookie: function( cookieName ) {
				var cookie = cookieName || this.options.orderingCookieName,
				buff = [];

				items.forEach( function( item ) {
					buff.push( item.attr('name') );
				});
				$.cookie( this.options.orderingCookieName, buff.join(',') );
			},

			loadOrderingFromCookie: function( cookieName ) {
				cookieName = cookieName || this.options.orderingCookieName;

				if ( !$.cookie( cookieName ) ) return;

				// iter over item names from cookie
				can.each($.cookie( cookieName ).split(','), function( itemName ) {

					// match against items and reorder
					items.forEach( function( item, index ) {
						if ( item.attr('name') === itemName ) {
							items.splice( items.indexOf(item), 1 );
							items.push(item);
							return;
						}
					});
				});

			}

		});
	}
);
