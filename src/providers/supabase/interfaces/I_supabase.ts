export interface IProject {
  id: number;
  slug: string;
  artist_id: number;
  artists: {
    first_name: string;
    last_name: string;
  };
  title: string;
  description: string;
  click_sound_url: string;
  images: IImage[];
}

export interface IImage {
  id: number;
  project_id: number;
  order: number;
  url: string;
  width: number;
  height: number;
  sound_effect: string;
  is_featured: boolean;
}
