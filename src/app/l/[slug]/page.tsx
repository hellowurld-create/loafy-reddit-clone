import MiniCreatePost from "@/components/MiniCreatePost"
import NotFound from "@/components/NotFound"
import PostFeed from "@/components/PostFeed"
import { INFINITE_SCROLLING_PAGINATION } from "@/config/config"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"

interface PageProps{
    params: {
      slug: string  
    }
}

const page = async({ params }: PageProps) => {
    const { slug } = params
    const session = await getAuthSession()

    const subreddit = await db.subreddit.findFirst({
        where: {
            name: slug
        },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    subreddit: true,
                },
                orderBy: {
                  createdAt: 'desc',  
                },
                take: INFINITE_SCROLLING_PAGINATION
            }
        }
    })

    if (!subreddit) {
        return <NotFound/>
    }
    return (
      <>
    <h1 className="font-bold text-3xl md:text-4xl h-14">
      l/{subreddit.name}
      </h1>
            <MiniCreatePost session={session} />
            {/* TODO: Show posts in user feed */}
            <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
      </>
  )
}

export default page
