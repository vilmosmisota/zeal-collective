export interface IProjectRaw {
  id: number;
  slug: string;
  artists: IArtist;
  title: string;
  description: string;
  click_sound_url: string;
  featured_img: string;
  preview_text: string;
  tags: string[];
  images: IImage[];
  frames: IFrame[];
}

export interface IImage {
  id: number;
  frame_id: number;
  project_id: number;
  order: number;
  url: string;
  width: number;
  height: number;
  position: "left" | "center" | "right" | "cover";
  size: "small" | "large" | "full";
}

export interface IFrame {
  color_theme: "light" | "dark";
  id: number;
  order: number;
  project_id: number;
  sound_effects: string[] | undefined;
  images: IImage[];
}

export interface IArtist {
  id: number;
  first_name: string;
  last_name: string;
}

export interface IProject {
  id: number;
  artists: IArtist;
  title: string;
  description: string;
  tags: string[];
  frames: IFrame[];
  click_sound_url: string;
}
