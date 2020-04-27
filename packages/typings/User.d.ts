declare namespace User {
  interface User {
    agreements: Agreement[];
    created_at: string;
    email: string;
    id: string;
    location_id: string;
    location_name: string;
    name: string;
    role: string;
    updated_at: string;
  }

  interface Agreement {
    id: string;
    idcc: string;
    name: string;
  }
}
