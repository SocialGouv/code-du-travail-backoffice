declare namespace Log {
  interface Log {
    body: string | null;
    method: LogMethod;
    ip: string;
    path: string;
    user_id: string | null;
  }

  type Method = "delete" | "patch" | "post";
}
