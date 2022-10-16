import { GetStaticPaths, GetStaticProps } from "next";
import {
  getProjectBySlug,
  getProjectSlugs,
} from "../../providers/supabase/getData";
import {
  IImage,
  IProject,
} from "../../providers/supabase/interfaces/I_supabase";
import ProjectView from "../../views/project/ProjectView";
7;

export type ProjectProps = {
  project: IProject;
};

export default function Project({ project }: ProjectProps) {
  return <ProjectView project={project} />;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  const data = await getProjectBySlug(slug);

  const { images: imgs, frames } = data;

  const mFrames = frames
    .map((item) => {
      const images: IImage[] = [];
      imgs.forEach((img) => {
        if (img.frame_id !== item.id) return;
        images.push(img);
      });

      return {
        ...item,
        images,
      };
    })
    .sort((a, b) => {
      if (a.order > b.order) {
        return 1;
      }

      if (a.order < b.order) {
        return -1;
      }
      return 0;
    });

  return {
    props: {
      project: {
        id: data.id,
        slug: data.slug,
        artists: {
          id: data.artists.id,
          first_name: data.artists.first_name,
          last_name: data.artists.last_name,
        },
        featured_img: data.featured_img,
        title: data.title,
        description: data.description,
        click_sound_url: data.click_sound_url,
        tags: data.tags,
        frames: mFrames,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getProjectSlugs();
  const paths = slugs.map((slug) => ({ params: { slug } }));
  return {
    paths,
    fallback: false,
  };
};
