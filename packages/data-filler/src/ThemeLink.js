import React from "react";

import Link from "next/link";

const { DATA_FILLER_PATH } = process.env;

const ThemeLink = ({ bucket, collection, record, item }) => (
  <Link
    href={`${DATA_FILLER_PATH}/bucket/[bucket]/collection/[collection]/record/[record]`}
    as={`${DATA_FILLER_PATH}/bucket/${bucket}/collection/${collection}/record/${item.id}`}
    passHref
  >
    <a style={{ color: item.id === record ? "white" : "#0053b3" }}>{item.title || "-----"}</a>
  </Link>
);

export default ThemeLink;
