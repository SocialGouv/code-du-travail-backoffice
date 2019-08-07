import React from "react";

export default function excerpt(text, length = 100) {
  const source = text.trim();
  if (source.length === 0) return <em>Aucun contenu.</em>;
  if (source.length <= length) return source;

  const lastSpaceIndex = source.substr(0, length).lastIndexOf(" ");

  return `${source.substr(0, lastSpaceIndex)}…`;
}
