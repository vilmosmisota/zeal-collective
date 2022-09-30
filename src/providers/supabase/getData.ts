import { supabase } from "../../libs/supabase";
import { IProject } from "./interfaces/I_supabase";

export const getProjectBySlug = async (slug: string): Promise<IProject> => {
  const { data, error } = await supabase
    .from<IProject>("projects")
    .select("*, artists:artist_id(first_name, last_name), images!inner(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data;
};

export const getProjectSlugs = async () => {
  const { data, error } = await supabase
    .from<IProject>("projects")
    .select("slug");

  if (error) {
    console.log(error.message);
    throw error;
  }

  const slugs = data.map((el) => el.slug);
  return slugs;
};
