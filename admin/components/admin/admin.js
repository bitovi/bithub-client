steal(
	'can/util/string',
	'can/component',
	'./admin.mustache',
	'admin/components/dashboard',
	'admin/components/services',
	'admin/components/scoring_rules',
	'admin/components/rewards',
	'admin/components/settings',
	'admin/components/users',
	'admin/components/integration',
	'admin/components/getting_started',
	'admin/components/categories',
	'admin/components/achievements',
	'./admin.less',
	function(can, Component, adminView){

		var pages = [
			"Dashboard",
			"Services",
			"Categories",
			"Scoring Rules",
			"Rewards",
			//"Registered Users",
			//"Integration",
			"Achievements",
			"Users",
			"Settings"
		];

		var urlMappings = {
			'registered-users' : 'users'
		}

		return can.Component({
			tag : 'admin',
			template : adminView,
			scope : {

			},
			helpers : {
				menu : function(){
					var currentPage = can.route.attr('page');
					return can.map(pages, function(page){
						var url = page.toLowerCase().replace(/ /g, '-'),
							html =['<li'];

						url = urlMappings[url] || url;

						if(url === currentPage){
							html.push(' class="active"');
						}
						html.push('>');
						html.push(can.route.link(page, {page: url}))
						html.push('</li>');
						return html.join('');
					}).join('');
				},
				currentPage : function(){
					var page = can.route.attr('page'),
						renderer = can.view.mustache('<'+page+' onpage="true"></'+page+'>');
					return renderer.render()

				}
			}
		})

	});