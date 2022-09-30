import ProjectCard from "../cards/ProjectCard";

type ProjectsMetaType = {
  featuredImg: {
    src: string;
    title: string;
    width: number;
    height: number;
  };
  artist: string;
  title: string;
  description: string;
  tags: string[];
  slug: string;
}[];

export default function ProjectLists({
  projectsMeta,
}: {
  projectsMeta: ProjectsMetaType;
}) {
  return (
    <>
      <div className="mb-5">
        <h2 className="text-zinc300">Demo</h2>
      </div>
      <section className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 place-items-center ">
        {projectsMeta.map((item) => {
          return <ProjectCard key={item.slug} projectMeta={item} />;
        })}
      </section>
    </>
  );
}
