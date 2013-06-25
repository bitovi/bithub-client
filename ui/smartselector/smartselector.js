steal('can',
	  './init.ejs',
	  'jquerypp/dom/cookie',
	  function(can, initView){
		  var items = new can.Observe.List();
		  
		  var smartSelectorItemRoute = can.compute(function(item) {
			  return can.route.url({
				  category: item.name,
				  project: can.route.attr('project'),
				  view: can.route.attr('view')
			  }, true);
		  })

		  return can.Control(
			  /** @Static */
			  {
				  defaults : { orderingCookieName: 'foobar' }
			  },
			  /** @Prototype */
			  {
				  init : function( elem, opts ){
					  var self = this;
					  self.element.html(initView( {
						  htmlId: self.options.htmlId,
						  defaultOption: self.options.defaultOption,
						  items: self.options.items,
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

				  // "{can.route} change": function(el, ev, attr, how, newVal, oldVal) {
					  // if (attr === "category" && (how === 'set' || how === 'add')) {
						  // if (this.options.items.length > 0) {
							  // var selectedItem;
							  // can.each(this.options.items, function(item) {
								  // if (item.name == newVal) selectedItem = newItem;
							  // })
							  // items.splice(items.indexOf(selectedItem), 1);
							  // items.unshift(selectedItem);
							  // this.saveOrderingToCookie();
						  // }
					  // }
				  // },

				  "{items} change": function() {
					  this.options.items.forEach( function( item ) {
						  items.push({name: item.attr('name'), display_name: item.attr('display_name') });
					  });
					  this.loadOrderingFromCookie();
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
	  });
