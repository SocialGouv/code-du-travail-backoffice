import customPostgrester from "../libs/customPostgrester";

export type ApiFetchType = "GET" | "POST" | "PUT" | "DELETE";

export function apiFetch(
  method: ApiFetchType,
  path: string,
  data?: Record<string, any>,
): Promise<any> {
  return new Promise((resolve, reject) => {
    customPostgrester()({
      method,
      url: process.env.API_URI + path,
      data,
    }).then(
      result => {
        resolve(result);
      },
      error => {
        reject(error);
      },
    );
  });
}
