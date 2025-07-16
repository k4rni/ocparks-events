export interface Event {
  title: string;
  start: string;
  end: string;
  datetime: string;
  url: string | null;
  location: string;
  description: string;
  image: string;
  tags: string[];
}
