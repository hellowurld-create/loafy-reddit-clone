import { INFINITE_SCROLLING_PAGINATION } from "@/config/config"
import { db } from "@/lib/db"
import PostFeed from "./PostFeed"


const GeneralFeed = async () => {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLING_PAGINATION, // 4 to demonstrate infinite scroll, should be higher in production
  })

  return <PostFeed initialPosts={posts} />
}

export default GeneralFeed