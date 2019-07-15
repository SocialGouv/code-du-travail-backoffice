/* eslint-disable max-len */

import postgrest from "../postgrest";

describe("lib/postgrest()", () => {
  const query = postgrest();
  const TEST_PATH = "/path";
  const TEST_DATA = { foo: "bar" };

  it("should have the expected initial props & values", () => {
    expect(query).toHaveProperty("axios");
    expect(query).toHaveProperty("ands", []);
    expect(query).toHaveProperty("isAnd", false);
    expect(query).toHaveProperty("isOr", false);
    expect(query).toHaveProperty("isNot", false);
    expect(query).toHaveProperty("orderers", []),
      expect(query).toHaveProperty("ors", []);
    expect(query).toHaveProperty("queries", []);
    expect(query).toHaveProperty("selectors", []);
  });

  it("should get the expected path", async () => {
    global.axios.get.mockResolvedValueOnce({ data: {}, headers: {} });

    await query
      .eq("eqFieldNumber", 123)
      .eq("eqFieldString", "A string")
      .like("likeField", "Another string")
      .ilike("ilikeField", "Yet another string")
      .orderBy("ascField")
      .orderBy("descField", false)
      .page(1, 10)
      .get(TEST_PATH);

    expect(global.axios.get).toHaveBeenCalledWith(
      `${TEST_PATH}?eqFieldNumber=eq.123&eqFieldString=eq."A string"&likeField=like."*Another string*"&ilikeField=ilike."*Yet another string*"&limit=10&offset=10&select=*&order=ascField.asc,descField.desc`,
      {}
    );
  });

  it("should get the expected path (with not)", async () => {
    global.axios.get.mockResolvedValueOnce({ data: {}, headers: {} });

    await query.not
      .eq("eqFieldNumber", 123)
      .not.like("likeField", "Another string")
      .not.ilike("ilikeField", "Yet another string")
      .page(2)
      .get(TEST_PATH);

    expect(global.axios.get).toHaveBeenCalledWith(
      `${TEST_PATH}?eqFieldNumber=not.eq.123&likeField=not.like."*Another string*"&ilikeField=not.ilike."*Yet another string*"&limit=10&offset=20&select=*`,
      {}
    );
  });

  it("should get the expected path (with and)", async () => {
    global.axios.get.mockResolvedValueOnce({ data: {}, headers: {} });

    await query.and
      .eq("eqFieldNumber", 123)
      .like("likeField", "Another string")
      .ilike("ilikeField", "Yet another string")
      .get(TEST_PATH);

    expect(global.axios.get).toHaveBeenCalledWith(
      `${TEST_PATH}?and=(eqFieldNumber.eq.123,likeField.like."*Another string*",ilikeField.ilike."*Yet another string*")&select=*`,
      {}
    );
  });

  it("should get the expected path (with or)", async () => {
    global.axios.get.mockResolvedValueOnce({ data: {}, headers: {} });

    await query.or
      .eq("eqFieldNumber", 123)
      .like("likeField", "Another string")
      .ilike("ilikeField", "Yet another string")
      .get(TEST_PATH);

    expect(global.axios.get).toHaveBeenCalledWith(
      `${TEST_PATH}?or=(eqFieldNumber.eq.123,likeField.like."*Another string*",ilikeField.ilike."*Yet another string*")&select=*`,
      {}
    );
  });

  it("should get the expected path (with not and)", async () => {
    global.axios.get.mockResolvedValueOnce({ data: {}, headers: {} });

    await query.not.and
      .eq("eqFieldNumber1", 123)
      .eq("eqFieldNumber2", 456)
      .get(TEST_PATH);

    expect(global.axios.get).toHaveBeenCalledWith(
      `${TEST_PATH}?not.and=(eqFieldNumber1.eq.123,eqFieldNumber2.eq.456)&select=*`,
      {}
    );
  });

  it("should get the expected path (with not or)", async () => {
    global.axios.get.mockResolvedValueOnce({ data: {}, headers: {} });

    await query.not.or
      .eq("eqFieldNumber1", 123)
      .eq("eqFieldNumber2", 456)
      .get(TEST_PATH);

    expect(global.axios.get).toHaveBeenCalledWith(
      `${TEST_PATH}?not.or=(eqFieldNumber1.eq.123,eqFieldNumber2.eq.456)&select=*`,
      {}
    );
  });

  it("should post the expected path with expected data", async () => {
    global.axios.post.mockResolvedValueOnce({ data: {}, headers: {} });

    await query.post(TEST_PATH, TEST_DATA);

    expect(global.axios.post).toHaveBeenCalledWith(TEST_PATH, TEST_DATA);
  });

  it("should patch the expected path with expected data", async () => {
    global.axios.patch.mockResolvedValueOnce({ data: {}, headers: {} });

    await query.eq("id", 1).patch(TEST_PATH, TEST_DATA);

    expect(global.axios.patch).toHaveBeenCalledWith(
      `${TEST_PATH}?id=eq.1`,
      TEST_DATA
    );
  });

  it("should delete the expected path", async () => {
    global.axios.delete.mockResolvedValueOnce({ data: {}, headers: {} });

    await query.eq("id", 1).delete(TEST_PATH);

    expect(global.axios.delete).toHaveBeenCalledWith(`${TEST_PATH}?id=eq.1`);
  });

  it("should get the expected path (with select)", async () => {
    global.axios.get.mockResolvedValueOnce({ data: {}, headers: {} });

    await query.select("selectField").get(TEST_PATH);

    expect(global.axios.get).toHaveBeenCalledWith(
      `${TEST_PATH}?select=selectField`,
      {}
    );
  });

  it("should get the expected path (with in)", async () => {
    global.axios.get.mockResolvedValueOnce({ data: {}, headers: {} });

    await query
      .in("inFieldNumber", [1, 2])
      .in("inFieldString", ["A string", "Another string"], true)
      .not.in("notInFieldNumber", [3, 4])
      .get(TEST_PATH);

    expect(global.axios.get).toHaveBeenCalledWith(
      `${TEST_PATH}?inFieldNumber=in.(1,2)&inFieldString=in.("A string","Another string")&notInFieldNumber=not.in.(3,4)&select=*`,
      {}
    );
  });

  it("should get the expected path (with is)", async () => {
    global.axios.get.mockResolvedValueOnce({ data: {}, headers: {} });

    await query
      .is("isFieldNull1", null)
      .is("isFieldTrue1", true)
      .is("isFieldFalse1", false)
      .not.is("isFieldNotNull1", null)
      .eq("isFieldNull2", null)
      .eq("isFieldTrue2", true)
      .eq("isFieldFalse2", false)
      .not.eq("isFieldNotNull2", null)
      .get(TEST_PATH);

    expect(global.axios.get).toHaveBeenCalledWith(
      `${TEST_PATH}?isFieldNull1=is.null&isFieldTrue1=is.true&isFieldFalse1=is.false&isFieldNotNull1=not.is.null&isFieldNull2=is.null&isFieldTrue2=is.true&isFieldFalse2=is.false&isFieldNotNull2=not.is.null&select=*`,
      {}
    );
  });

  it("should get the expected response (with `mustCount`)", async () => {
    global.axios.get.mockResolvedValueOnce({
      data: {},
      headers: {
        "content-range": "10-19/20"
      }
    });

    const { pageLength } = await query.get(TEST_PATH, true);

    expect(pageLength).toBe(2);
  });
});
