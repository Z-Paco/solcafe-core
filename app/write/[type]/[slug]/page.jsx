import PostEditor from "@/components/content-editors/PostEditor";
import { typeFromParam } from "@/lib/editor";

export const metadata = { title: "Edit", robots: { index: false } };

export default async function EditPostPage({ params }) {
  const { type, slug } = await params;
  return <PostEditor mode="edit" initialType={typeFromParam(type)} slug={slug} />;
}
