import PostEditor from "@/components/content-editors/PostEditor";
import { typeFromParam } from "@/lib/editor";

export const metadata = { title: "Write", robots: { index: false } };

export default async function WritePage({ searchParams }) {
  const { type } = await searchParams;
  return <PostEditor mode="create" initialType={typeFromParam(type)} />;
}
