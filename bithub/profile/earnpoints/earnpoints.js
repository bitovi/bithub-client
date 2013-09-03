steal('can',
	  './init.mustache',
	  '../_navbar.mustache',
	  function(can, initView, navbarPartial){

		  var watched = new can.Observe.List(),
			  starred = new can.Observe.List();

		  return can.Control.extend({
				  defaults : {}
			  }, {
				  init : function( elem, opts ){
					  var self = this,
						  user = opts.currentUser;
					  
					  this.element.html(initView({
						  user: user
					  }, {
						  helpers: {
							  hasProvider: function( provider, opts ) {
								  return user.getProvider( provider ) ? opts.fn(this) : opts.inverse(this);
							  },
							  isStarred: function( repo, opts ) {
								  starred.attr('length');
								  return _.filter(starred, function( item ) {
									  return item.attr('name') == repo;
								  }).length ? opts.fn(this) : opts.inverse(this);
							  },
							  isWatched: function( repo, opts ) {
								  watched.attr('length');
								  return _.filter(watched, function( item ) {
									  return item.attr('name') == repo;
								  }).length ? opts.fn(this) : opts.inverse(this);
							  }

						  },
						  partials: {
							  navbarPartial: navbarPartial
						  }
					  }));

					  if( user.isLoggedIn() ) this.loadGithub();
				  },

				  '{currentUser} isLoggedIn change': "loadGithub",

				  loadGithub: function() {
					  var user = this.options.currentUser;

					  user.queryGithub("starred", function( data ) {
						  starred.replace( data );
					  });
					  user.queryGithub("watched", function( data ) {
						  watched.replace( data );
					  });
				  }
			  });
	  });
