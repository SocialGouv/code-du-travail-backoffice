/* eslint-disable max-len */

import styled from "@emotion/styled";

export default styled.select`
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: white;
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDM4Ni4yNTcgMzg2LjI1NyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzg2LjI1NyAzODYuMjU3OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cG9seWdvbiBwb2ludHM9IjAsOTYuODc5IDE5My4xMjksMjg5LjM3OSAzODYuMjU3LDk2Ljg3OSAiLz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K");
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;
  border: solid 1px var(--color-border);
  border-radius: 0;
  color: inherit;
  flex-grow: 1;
  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;
  height: 2rem;
  line-height: 1;
  opacity: ${({ disabled }) => (Boolean(disabled) ? 0.25 : 1)};
  padding: 0.4rem 0.6rem 0.575rem;
  width: 100%;
`;
