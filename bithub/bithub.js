// Load all of the plugin dependencies
steal(
    'can',
    'bithub/pageswitcher',
    'bithub/navigator',
    'bithub/login',
    'bithub/newpost',
    'bithub/lib/query_tracker.js',
    'bithub/modals',
    'bithub/models/event.js',
    'bithub/models/tag.js',
    'bithub/models/user.js',
    'bithub/helpers/loadtime.js',
    'ui/onbottom.js',
    'can/route/pushstate',
    'vendor/bootstrap',
    'vendor/bootstrap-datepicker',
    'vendor/lodash',
    'vendor/jstz',

    function(can, PageSwitcher, Navigator, Login, Newpost, QueryTracker, Modals, Event, Tag, User, loadtime) {
        var href = window.location.href

        if(href.substr(href.length - 1) === '/' && href !== window.location.origin + "/"){
            window.location.href = href.substr(0, href.length - 1);
        }

        var self = this;

        if( steal.isBuilding ) {
            return
        }

        // Display load time
        loadtime();

        // Routes

        var projects = ['canjs', 'donejs', 'javascriptmvc', 'funcunit', 'jquerypp', 'stealjs', 'canui', 'documentjs'],
            categories = ['bug', 'issue', 'twitter', 'question', 'article', 'comment', 'app', 'code', 'chat', 'plugin', 'event', 'feature'],
            timespans = ['day', 'week', 'month', 'all'];

        var routes = [{
            params: ['admin'],
            paramKey: 'page',
            defaultProps: {view: 'users', action: 'list'},
            childs: [{
                params: ['tags', 'users', 'rewards', 'achievements'],
                paramKey: 'view',
                childs: [{
                    params: ['edit', 'new'],
                    paramKey: 'action'
                }]
            }]
        },{
            params: ['latest'],
            paramKey: 'view',
            defaultProps: {page: 'homepage', view: 'latest', project: 'all', category: 'all', timespan: 'all'},
            childs: [{
                params: categories,
                paramKey: 'category'
            },{
                params: projects,
                paramKey: 'project',
                childs: [{
                    params: categories,
                    paramKey: 'category'
                }]
            }]
        },{
            params: ['greatest'],
            paramKey: 'view',
            defaultProps: {page: 'homepage', view: 'latest', project: 'all', category: 'all', timespan: 'month'},
            childs: [{
                params: timespans,
                paramKey: 'timespan'
            },{
                params: categories,
                paramKey: 'category',
                childs: [{
                    params: timespans,
                    paramKey: 'timespan'
                }]
            },{
                params: projects,
                paramKey: 'project',
                childs: [{
                    params: timespans,
                    paramKey: 'timespan'
                },{
                    params: categories,
                    paramKey: 'category',
                    childs: [{
                        params: timespans,
                        paramKey: 'timespan'
                    }]
                }]
            }]
        }];

        var declareRoute = function( coll, prefix, exclude ) {
            prefix = prefix || '/';
            exclude = exclude || [];

            return (prefix + _.difference(coll, exclude).join('/')).replace('//','/');
        };

        var genRoutes = function( routes, prefix, props ) {
            prefix = prefix || '/';
            props = props || {};

            _.each(routes, function(v, k, l) {
                var params = v.params,
                    childs = v.childs,
                    key = v.paramKey,
                    defaultProps = v.defaultProps;

                _.each(params, function(v, k, l) {
                    var exclude = (defaultProps && defaultProps[key]) || [];
                    var route = declareRoute( [v], prefix, exclude );

                    var newProps = {};
                    _.extend(newProps, defaultProps, props)
                    newProps[key] = v;

                    //console.log( route, newProps );
                    can.route( route, newProps );

                    if( childs ) {
                        genRoutes( childs, route + '/', newProps );
                    }
                });
            });
        };

        genRoutes( routes );

        can.route('/rewards', { page: 'rewards' });
        can.route('/rewards/new', { page: 'rewards', action: 'new' });
        can.route('/leaderboard', { page: 'leaderboard' });
        can.route('/earnpoints', { page: 'earnpoints' });



        can.route('/profile', { page: 'profile', view: 'info' });
        can.route('/profile/activities', { page: 'profile', view: 'activities' });


        can.route('/profile/:id', {page : 'user_profile'})

        //can.route('/profile/rewards', { page: 'profile', view: 'rewards' });
        //can.route('/profile/earn-points', { page: 'profile', view: 'earnpoints' });

        can.route('/event/:id', { page: 'eventdetails' });

        can.route.ready();

        var newpostVisibility = can.compute(false),
            projects          = new can.Model.List(),
            categories        = new can.Model.List(),
            feeds             = new can.Model.List(),
            users             = new Bithub.Models.User.List(),
            currentUser       = new User(),
            preloadedEvents   = new Bithub.Models.Event.List([{}]),
            visibleTags       = new can.Observe.List();

        // insert client TZ in every ajax req header
        $.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('clientTz', jstz.determine().name() || 'UTC');
            }
        });

        // Preload events on route init
        window.EVENTS_PRELOADED = false;

        // Init query tracker and preload events
        var queryTracker = new QueryTracker({}, function(params) {
            var finder = can.route.attr('view') === 'latest' ? 'Latest' : 'Greatest';
            Event['find' + finder](
                params || queryTracker.current(),
                function( events ) {
                    // this prevents events control to trigger on initial can.route change
                    window.EVENTS_PRELOADED = true;
                    preloadedEvents.replace(events);

                    // trigger change manually if there are no events
                    events.length == 0 && preloadedEvents._triggerChange('length', 'add');
                });
        });

        // expose some as globals
        CURRENT_USER  = currentUser;
        QUERY_TRACKER = queryTracker;
        VISIBLE_TAGS  = visibleTags;

        CATEGORIES = categories;
        PROJECTS   = projects;


        // Initialize the current user (if there is one)
        currentUser.fromSession();

        // Init Controllers
        var modals = new Modals('#bootstrapModals', {
            currentUser: currentUser
        });

        new PageSwitcher('#pages', {
            currentUser: currentUser,
            preloadedEvents: preloadedEvents,
            queryTracker: queryTracker,
            projects: projects,
            feeds: feeds,
            categories: categories,
            newpostVisibility: newpostVisibility,
            modals: modals,
            users: users,
            visibleTags: visibleTags
        });

        new Navigator('#navigator', {
            currentUser: currentUser,
            projects: projects,
            categories: categories
        });

        new Login('#login', {
            currentUser: currentUser,
            newpostVisibility: newpostVisibility
        });

        new Newpost('#newpost-form-container', {
            currentUser: currentUser,
            modals: modals,
            projects: projects,
            categories: categories,
            visibility: newpostVisibility,
            project: can.route.attr('newpost_p') || '',
            category: can.route.attr('newpost_c') || ''
        });

        can.route.attr('newpost') && newpostVisibility(true);


        var updateVisibleTags = function( tags, props ) {
            var buffer = _.each(tags.attr(), function(item) {
                can.extend(item, props);
            });
            visibleTags.push.apply(visibleTags, buffer);
        }

        // Load category tags
        Tag.findAll({type: 'category', order: 'priority:desc'}, function (data) {

            var blacklisted = ['digest','issue','github_comment'], remove = [];
            data.each(function(el, i) {
                (blacklisted.indexOf(el.attr('name')) >= 0) && remove.unshift(i);
            });
            for(var idx = 0; idx < remove.length; idx++) { data.splice(remove[idx], 1) }

            categories.replace(data);
            updateVisibleTags( data, {type: 'category'} );
        });

        // Load project tags
        Tag.findAll({type: 'project'}, function (data) {
            projects.replace(data);
            updateVisibleTags( data, {type: 'project'} );
        });

        // Load feed tags
        Tag.findAll({type: 'feed'}, function (data) {
            feeds.replace(data);
        });

        // Load leaderboard
        (function loadUsers() {
            User.findAll( {cached: true}, function (data) {
                users.replace(data);
            });
            setTimeout(loadUsers, 60000);
        })();

        window.addEventListener('message', function(event){
            var data = event.data;
            if(window.location.origin === event.origin && data.type && data.message){
                can.trigger(window, data.type, data.message);
            }
        })

        new UI.Onbottom(document, {threshold: $(window).innerHeight() / 2 });

    }
);
