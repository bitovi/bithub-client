steal('can',
	  './init.ejs',
	  'jquerypp/dom/cookie',
	  function(can, initView){
		  
		  var items = new can.Observe.List();		  

		  return can.Control(
			  /** @Static */
			  {
				  defaults : { orderingCookieName: 'foobar' }
			  },
			  /** @Prototype */
			  {
				  init : function( elem, opts ){
					  var self = this;
					  
					  self.element.html( initView( {
						  htmlId: opts.htmlId,
						  defaultOption: opts.defaultOption,
						  items: items,
						  breakIdx: opts.breakIdx || 3
					  }, {
						  isSelected: function( name, opts ) {
							  name = (typeof(name) === 'function') ? name() : name;
							  return (self.options.state() === name) ? 'active' : '';
						  },
						  itemUrl: function (item) {
							  return can.route.url({ category: item.name }, true);
						  }
					  }) );
				  },


				  '{items} change': function() {
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
