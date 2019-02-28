class SessionStorage {
  constructor() {
    this.items = {};
  }

  getItem(key) {
    return this.items[key] === undefined ? null : this.items[key];
  }

  setItem(key, value) {
    this.items[key] = value;
  }
}

global.sessionStorage = new SessionStorage();
