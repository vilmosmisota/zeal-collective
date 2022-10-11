import { supabase } from "../../libs/supabase";
import { IProjectRaw } from "./interfaces/I_supabase";

export const getProjectBySlug = async (slug: string): Promise<IProjectRaw> => {
  const { data, error } = await supabase
    .from<IProjectRaw>("projects")
    .select(
      "*, artists:artist_id(id, first_name, last_name), frames!inner(*), images!inner(*)"
    )
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
    .from<IProjectRaw>("projects")
    .select("slug");

  if (error) {
    console.log(error.message);
    throw error;
  }

  const slugs = data.map((el) => el.slug);
  return slugs;
};
