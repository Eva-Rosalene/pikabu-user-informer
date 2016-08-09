class Cache {
  constructor () {
    this.cache = {};
  }

  add (key, value) { this.cache[key] = value }

  match (key) { return this.cache[key] }

  has (key) { return !!this.cache[key] }
};

export default Cache;