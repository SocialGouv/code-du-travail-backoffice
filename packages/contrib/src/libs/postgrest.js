import customAxios from "../libs/customAxios";

/**
 * @see http://postgrest.org/en/latest/api.html#horizontal-filtering-rows
 */
class Postgrest {
  constructor() {
    this.reset();
  }

  reset() {
    this.axios = customAxios();
    this.ands = [];
    this.isAnd = false;
    this.isOr = false;
    this.isNot = false;
    this.orderers = [];
    this.ors = [];
    this.queries = [];
    this.selectors = [];
  }

  clone(object = this) {
    if (object === null || typeof object !== "object") return object;

    const props = Object.getOwnPropertyDescriptors(object);
    for (var prop in props) {
      props[prop].value = this.clone(props[prop].value);
    }

    return Object.create(Object.getPrototypeOf(object), props);
  }

  buildUri(path) {
    const { queries } = this;

    if (this.ands.length !== 0) {
      const isNot = this.isNot ? "not." : "";

      queries.push(`${isNot}and=(${this.ands.join(",")})`);
    }

    if (this.ors.length !== 0) {
      const isNot = this.isNot ? "not." : "";

      queries.push(`${isNot}or=(${this.ors.join(",")})`);
    }

    queries.push(
      `select=${this.selectors.length !== 0 ? this.selectors.join(",") : "*"}`
    );

    if (this.orderers.length !== 0) {
      queries.push(`order=${this.orderers.join(",")}`);
    }

    const uri = `${path}?${queries.join("&")}`;

    return uri;
  }

  async get(path, mustCount = false) {
    const uri = this.buildUri(path);
    this.reset();

    const config = mustCount
      ? {
          headers: {
            Prefer: "count=exact"
          }
        }
      : {};

    const { data, headers } = await this.axios.get(uri, config);

    let pageLength;
    if (mustCount && headers["content-range"] !== undefined) {
      const length = Number(headers["content-range"].split("/")[1]);
      pageLength = Math.ceil(length / this.limit);
    }

    return { data, pageLength };
  }

  async post(path, data) {
    this.reset();

    await this.axios.post(path, data);
  }

  async patch(path, data) {
    const uri = this.buildUri(path);
    this.reset();

    await this.axios.patch(uri, data);
  }

  async delete(path) {
    const uri = this.buildUri(path);
    this.reset();

    await this.axios.delete(uri);
  }

  select(selector) {
    this.selectors.push(selector);

    return this;
  }

  orderBy(column, isAsc = true) {
    this.orderers.push(`${column}.${isAsc ? "asc" : "desc"}`);

    return this;
  }

  page(pageIndex, limit = 10) {
    this.limit = limit;
    this.queries.push(`limit=${limit}`);
    this.queries.push(`offset=${pageIndex * limit}`);

    return this;
  }

  get and() {
    this.isAnd = true;

    return this;
  }

  get or() {
    this.isOr = true;

    return this;
  }

  get not() {
    this.isNot = true;

    return this;
  }

  eq(column, value) {
    if (typeof value === "boolean" || value === null) {
      return this.is(column, value);
    }

    const isNot = this.isNot ? "not." : "";

    if (this.isAnd) {
      this.ands.push(`${column}.eq.${value}`);
    } else if (this.isOr) {
      this.ors.push(`${column}.eq.${value}`);
    } else {
      this.queries.push(`${column}=${isNot}eq.${value}`);
      this.isNot = false;
    }

    return this;
  }

  like(column, value) {
    const isNot = this.isNot ? "not." : "";

    if (this.isAnd) {
      this.ands.push(`${column}.like."*${value}*"`);
    } else if (this.isOr) {
      this.ors.push(`${column}.like."*${value}*"`);
    } else {
      this.queries.push(`${column}=${isNot}like."*${value}*"`);
      this.isNot = false;
    }

    return this;
  }

  ilike(column, value) {
    const isNot = this.isNot ? "not." : "";

    if (this.isAnd) {
      this.ands.push(`${column}.ilike."*${value}*"`);
    } else if (this.isOr) {
      this.ors.push(`${column}.ilike."*${value}*"`);
    } else {
      this.queries.push(`${column}=${isNot}ilike."*${value}*"`);
      this.isNot = false;
    }

    return this;
  }

  in(column, values, areQuotedStrings = false) {
    const finalValues = areQuotedStrings
      ? values.map(value => `"${value}"`)
      : values;
    const isNot = this.isNot ? "not." : "";

    this.queries.push(`${column}=${isNot}in.(${finalValues.join(",")})`);
    this.isNot = false;

    return this;
  }

  is(column, value) {
    const isNot = this.isNot ? "not." : "";

    this.queries.push(`${column}=${isNot}is.${String(value)}`);
    this.isNot = false;

    return this;
  }
}

export default () => new Postgrest();
