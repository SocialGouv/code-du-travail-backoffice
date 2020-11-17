// 4 hours
const CACHE_AGE_MAX = 4 * 60 * 60 * 1000;

class Cache {
  constructor() {
    this.cache = null;
    this.updatedAt = null;
  }

  async initialize() {
    if (this.cache !== null) {
      return;
    }

    this.cache = await caches.open("default");
    this.updatedAt = Date.now();
  }

  async get(path) {
    if (this.cache === null) {
      await this.initialize();
    }

    if (this.hasToUpdate()) {
      await caches.delete("default");

      return;
    }

    const response = await this.cache.match(path);
    if (response === undefined) {
      return;
    }

    const data = await response.json();

    return data;
  }

  async set(path, response) {
    if (this.cache === null) {
      await this.initialize();
    }

    await this.cache.put(path, new Response(JSON.stringify(response)));
  }

  hasToUpdate() {
    const cacheAgeInMs = Date.now() - this.updatedAt;

    return cacheAgeInMs >= CACHE_AGE_MAX;
  }
}

export default new Cache();
