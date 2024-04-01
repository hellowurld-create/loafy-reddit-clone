import { db } from "@/lib/db"
import NotFound from "./NotFound"
import { getAuthSession } from "@/lib/auth"
import { INFINITE_SCROLLING_PAGINATION } from "@/config/config"
import PostFeed from "./PostFeed"


const CustomFeed = async () => {
  const session = await getAuthSession()

  // only rendered if session exists, so this will not happen
  if (!session) return <NotFound/>

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      subreddit: true,
    },
  })

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map((sub) => sub.subreddit.name),
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLING_PAGINATION,
  })

  return <PostFeed  initialPosts={posts} />
}

export default CustomFeed