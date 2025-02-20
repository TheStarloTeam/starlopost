import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import Comment from "@/components/forms/Comment";
import ThreadCard from "@/components/backups/ThreadCard";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchThreadById } from "@/lib/actions/thread.actions";
// import { checkThread } from '@/lib/detect';

export const revalidate = 0;

async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id, user.id);
  // const isNSFW = thread && thread.mediaUrl ? await checkThread(thread) : false;

  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={thread._id}
          currentUserId={user.id}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          mediaUrl={thread.mediaUrl}
          userId={thread.userId}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={params.id}
          currentUserImg={user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((childItem: any) => (
          <ThreadCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            userId={childItem.userId}
            isComment
          />
        ))}
      </div>
    </section>
  );
}

export default page;
