import Image from "next/future/image";
import Link from "next/link";

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
};

export default function ProjectCard({
  projectMeta,
}: {
  projectMeta: ProjectsMetaType;
}) {
  const { featuredImg } = projectMeta;

  return (
    <Link href={`/project/${projectMeta.slug}`}>
      <article className="rounded-xl bg-zinc50 p-4 mb-5 max-w-[400px] flex flex-col w-full min-w-[320px] ">
        <div className="mb-5 w-full h-full aspect-square  relative ">
          <Image
            src={featuredImg.src}
            alt={featuredImg.title}
            fill
            className="cover-img rounded-xl"
            sizes="(max-width: 768px) 95vw,
          (max-width: 1200px) 50vw,
          33vw"
          />
        </div>
        <div className="relative">
          <h3 className="mb-5 text-zinc800">{projectMeta.title}</h3>
          <h4 className="mb-5 text-zinc800">{projectMeta.artist}</h4>
        </div>
      </article>
    </Link>
  );
}
