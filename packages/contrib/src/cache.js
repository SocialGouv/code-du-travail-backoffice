class Cache {
  get(key) {
    return this[key] !== undefined ? this[key] : null;
  }

  set(key, value) {
    this[key] = value;
  }
}

export default new Cache();
