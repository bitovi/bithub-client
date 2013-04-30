steal(
		'can',
		'bithub/models/user.js',
		function (can, User) {
			var current = new User({loggedIn: false});
			current.fromSession();
			return current;
		}
);

