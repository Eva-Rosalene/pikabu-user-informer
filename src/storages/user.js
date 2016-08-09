import Cache from 'storages/cache'

class UserStorage {
  constructor () {
    this.cache = new Cache();
  }

  match (url) {
    if (this.cache.has(url)) { 
      return this.cache.match(url);
    }

    let promise = this.resolve(url);

    this.cache.add(url, promise);

    return promise;
  }

  resolve (url) { return $.get(url) }
};

export default UserStorage;