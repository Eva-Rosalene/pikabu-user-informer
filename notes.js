var Notes = (function ( ) {
	var scope = new WeakMap( );
	
	function Notes(exec, dm) {
		scope[this] = { };
		scope[this].exec = exec;
		scope[this].downloader = dm;
	}
	
	Notes.prototype = {
		getAll: function ( ) {
			var self = this;
			
			return scope[this].exec((function *( ) {
				var hasNotes = true;
				var users    = [ ];
				
				for (var i = 1; hasNotes; ++i) {
					var pData = yield scope[self].downloader.download(`/editprofile.php?cmd=notes&page=${i}`);
					var pDoc  = (new DOMParser( )).parseFromString(pData, 'text/html');
					
					var newUsers = Array.from(pDoc.querySelectorAll('[data-note-id]')).
						map(i => i.querySelector('a').href).
						map(i => i.slice(i.lastIndexOf('/') + 1));
						
					if (newUsers.length === 0)
						hasNotes = false;
					
					users = users.concat(newUsers);
				}
				
				return users;
			})( ));
		}
	};
	
	return Notes;
})( );