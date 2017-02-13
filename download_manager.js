var DownloadManager = (function ( ) {
	var scope = new WeakMap( );
	
	
	function DownloadManager(delay) {
		scope[this] = { };
		
		scope[this].downloadQueue = [ ];
		scope[this].instant = true;
		scope[this].cache = { };
		scope[this].delay = delay || 200;
		
		scope[this].downloadNext = function ( ) {
			var task = scope[this].downloadQueue[0];
			if (task === undefined) 
				return scope[this].instant = true;
			
			scope[this].download(task.address, task.callback, task.error);
		}
		
		scope[this].download = function (addr, res, error) {	
			var self = this;
			
			if (scope[this].cache[addr] !== undefined) {
				return setTimeout(function ( ) {
					scope[self].downloadQueue = scope[self].downloadQueue.slice(1);
					scope[self].downloadNext( );
					res(scope[self].cache[addr]);
				}, 0);
			}
			
			var xhr = new XMLHttpRequest( );
			xhr.open('GET', addr, true);
			
			xhr.onreadystatechange = function ( ) {
				if (xhr.readyState == 4) {
					scope[self].downloadQueue = scope[self].downloadQueue.slice(1);
					if (xhr.status == 200) {
						scope[self].cache[addr] = xhr.responseText;
					}
					scope[self].downloadNext( );
					
					if (xhr.status == 200) {
						res(xhr.responseText);
					} else {
						error(new Error(`Response has status code ${xhr.status} (${xhr.statusText})`));
					}
				}
			}
			
			xhr.onerror = function (err) {
				scope[self].downloadQueue = scope[self].downloadQueue.slice(1);
				scope[self].downloadNext( );
				error(err);
			}
			
			setTimeout(( ) => xhr.send(null), scope[this].delay);
		}
	}
	
	DownloadManager.prototype = {
		download: function (url) {
			var queue = scope[this].downloadQueue;
			var self = this;
			
			return new Promise((resolve, reject) => {
				queue.push({
					address: url,
					callback: resolve,
					error: reject
				});
				
				if (scope[self].instant) {
					scope[self].instant = false;
					scope[self].downloadNext( );
				}
			});
		},
		
		setDelay: function (delay) {
			scope[this].delay = delay;
		},
		
		getDelay: function (delay) {
			return scope[this].delay;
		},
		
		getCache: function ( ) {
			var cacheCopy = { };
			for (var key in scope[this].cache)
				cacheCopy[key] = scope[this].cache[key];
			
			return cacheCopy;
		},
		
		clearCache: function ( ) {
			scope[this].cache = { };
		}
	}
	
	return DownloadManager;
})( );