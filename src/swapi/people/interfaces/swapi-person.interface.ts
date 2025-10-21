export interface SwapiListResponse {
  message: string;
  results: SwapiItem[];
}

export interface SwapiItem {
  name: string;
  uid: string;
  url: string;
}

export interface SwapiPersonResponse {
  message: string;
  result: {
    description: string;
    properties: SwapiPerson;
    _id: string;
    uid: string;
    __v: number;
  };
}

export interface SwapiPerson {
    id: string;
    name: string;
    birth_year: string;
    height: string;
    gender: string;
    homeworld: string;
}