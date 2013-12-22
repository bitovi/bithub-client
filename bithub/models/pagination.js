steal(
	'can',
	'vendor/moment',
	'can/model/list',
	
	function (can) {
		
		var approximateSectionHeight = function(n, height, sectionTitle) {
			return n * height + (sectionTitle || SECTION_TITLE);
		}
		var ASHCurried100 = function(n) { return approximateSectionHeight(n, 100)  };
		

		var RULES = {
			'digest': 50,
			'feature': ASHCurried100,
			'bug': ASHCurried100,
			'app': ASHCurried100,
			'article': ASHCurried100,
			'chat': 30,
			'code': function(n) { return (approximateSectionHeight(n, 45)) },
			'comment': ASHCurried100,
			'event': ASHCurried100, 
			'plugin': ASHCurried100,
			'question': ASHCurried100,
			'twitter': ASHCurried100
		},
			TRESHOLD = 500,
			SECTION_TITLE = 35;		

		
		var approximateDayHeight = function( day, rules ) {
			rules = rules || RULES;

			var height=0,
				rule;

			for( var category in day ) {
				rule = rules[category];
				if( !rule ) continue;
				
				height += (typeof rule === "function") ? rule(day[category]) : rule;
			}

			return height;
		}
		
		var datespanBuilder = function(days, opts ) {
			opts = opts || {};
			var treshold = opts['treshold'] || TRESHOLD;
			
			var datespans = [],
				startDate, stopDate,
				height, currentHeight = 0,
				i,j;

			for(i=0; i<days.length; i++) {
				if( !startDate) startDate = days[i].date;
				stopDate = days[i].date;

				height = approximateDayHeight( days[i] );
				
				if( (currentHeight + height) >= treshold ) {
					startDate === stopDate ? datespans.push( startDate) : datespans.push( stopDate + ':' + startDate);
					startDate = null; stopDate = null; currentHeight = 0;
				} else {
					currentHeight += height;
				}
			}

			return datespans;
		}

		var defaultParams = {
			limit: 30,
			offset: 0
		}
		
		return can.Model.extend('Bithub.Models.Pagination', {
			id: 'date',			
			findAll : 'GET /api/events/pagination',

			defaultParams: function() {
				return can.extend({}, defaultParams);
			},

			getDateSpans: function( params, cb, opts ) {
				opts = opts || {};
				
				this.findAll( can.extend({}, defaultParams, params), function( data ) {
					cb( datespanBuilder( data.attr(), opts ) );
				})
			}
			
		}, {});
		
	});
