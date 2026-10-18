import { PostForm } from "../../components/posts/components/PostForm";
import { PostListing } from "./../../components/posts/PostListing";

export const Feed = () => {
  return (
    <>
      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <main className="min-w-0 grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
          <aside className="hidden h-fit space-y-3 xl:sticky xl:top-21 xl:block"></aside>
          <section className="space-y-4">
            <PostForm />
            <PostListing />
          </section>
          <aside className="hidden h-fit xl:sticky xl:top-21 xl:block"></aside>
        </main>
      </div>
    </>
  );
};
