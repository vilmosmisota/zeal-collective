import TextHeader from "../../components/header/TextHeader";
import ProjectLists from "../../components/lists/ProjectLists";

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

export default function HomeView() {
  return (
    <>
      <TextHeader />
      <main className="mt-5 text-center px-4 max-w-screen-xl mx-auto">
        <ProjectLists projectsMeta={projectsMeta} />
      </main>
    </>
  );
}

const projectsMeta = [
  {
    featuredImg: {
      src: "https://kyvqisljtzamvrttkpad.supabase.co/storage/v1/object/public/images/Vilmos%20Misota/1.jpg",
      title: "image",
      width: 1300,
      height: 868,
    },
    artist: "Vilmos Misota",
    title: "Chasing light and shape",
    description:
      "Lorem ipsum dolor sit amet. Vel molestias voluptatem et molestias possimus non tempore tempore ut ipsam libero aut ullam nobis et quia minus aut eveniet recusandae.",
    tags: ["black and white, surf, community"],
    slug: "echoes",
  },
  {
    featuredImg: {
      src: "https://kyvqisljtzamvrttkpad.supabase.co/storage/v1/object/public/images/Vilmos%20Misota/2.jpg",
      title: "image2",
      width: 1300,
      height: 868,
    },
    artist: "John Doe",
    title: "Everyday life",
    description:
      "Lorem ipsum dolor sit amet. Vel molestias voluptatem et molestias possimus non tempore",
    tags: ["colours, ambient, drama"],
    slug: "everyday-life",
  },
];
