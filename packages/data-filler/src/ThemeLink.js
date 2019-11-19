import React from "react";

import Link from "next/link";

const ThemeLink = ({ bucket, collection, record, item, focus = false }) => (
  <Link
    href={`/bucket/[bucket]/collection/[collection]/record/[record]`}
    as={`/bucket/${bucket}/collection/${collection}/record/${item.id}`}
    passHref
  >
    <a style={{ color: item.id === record ? "white" : "#0053b3" }}>
      {item.title || "-----"}
    </a>
  </Link>
);

export default ThemeLink;
