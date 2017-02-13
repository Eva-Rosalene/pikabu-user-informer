var exec = (function ( ) {
	function helper(resolve, reject, generator, isError, data) {
		try {
			var iterator = isError ? generator.throw(data) : generator.next(data);
			
			if (!iterator.done) {
				iterator.value.then((data) => helper(resolve, reject, generator, false, data),
									(error) => helper(resolve, reject, genetator, true, error));
			} else {
				resolve(iterator.value);
			}
		} catch (ex) {
			reject(ex);
		}
	}
	
	function exec(generator) {
		return new Promise((resolve, reject) => {
			helper(resolve, reject, generator, false);
		});
	}
	
	return exec;
})( );