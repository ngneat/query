// Generated by https://quicktype.io
export interface Episodes {
  info: Info;
  results: Episode[];
}

export interface Info {
  count: number;
  pages: number;
  next: string;
  prev: null;
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: SimplifiedLocation;
  location: SimplifiedLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface SimplifiedLocation {
  name: string;
  url: string;
}
export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}
