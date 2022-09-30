import { GetStaticPaths, GetStaticProps } from "next";
import {
  getProjectBySlug,
  getProjectSlugs,
} from "../../providers/supabase/getData";
import ProjectView from "../../views/project/ProjectView";

export default function Project() {
  return <ProjectView />;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  const data = await getProjectBySlug(slug);
  return { props: { data } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getProjectSlugs();
  const paths = slugs.map((slug) => ({ params: { slug } }));
  return {
    paths,
    fallback: false,
  };
};
