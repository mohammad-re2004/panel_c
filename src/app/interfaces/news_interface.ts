export interface NewsTime {
  created: string;
  updated: string;
}

export interface News {
  id: string;
  title: string;
  abstract: string;
  image: string;
  arrange: number;
  tags: string[];
  time: NewsTime;
  contents: NewsContent[] | null; 
}

export interface NewsContent {
  file: string;
  id: string;
  text: string;
  type: string;
  video: NewsVideo | null;
  videoId: string;
}

export interface NewsVideo {
  file: string;
  id: string;
  thumbnail: string;
  title: string;
}


export interface NewsFilter {
  page: number;
  limit: number;
  title: string;
  description: string;
  tags: string[];
  fromDate: string;
  toDate: string;
}


export interface PagedNews {
  data: News[];
  page: number;
  limit: number;
  totalPages: number;
}