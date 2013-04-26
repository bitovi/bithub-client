steal(
		'can',
		'bithub/models/user.js',
		function (can, User) {
			// var current = new User({loggedIn: false});
			var current = new User({loggedIn: true});
			current.fromSession();
			return current;
		}
);

