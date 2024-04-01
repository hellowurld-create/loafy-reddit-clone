import CommentSection from "@/components/CommentSection"
import EditorOutput from "@/components/EditorOutput"
import NotFound from "@/components/NotFound"
import PostVoteServer from "@/components/post-vote/PostVoteServer"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { formatTimeToNow } from "@/lib/utils"
import { CachedPost } from "@/types/redis"
import { Post, User, Vote } from "@prisma/client"
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react"
import { Suspense } from "react"


interface PageProps{
    params: {
        postId: string
    }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const page = async ({ params }: PageProps) => {
    const cachedPost = (await redis.hgetall(`post:${params.postId}`)) as CachedPost

    let post: (Post & {votes: Vote[]; author:User}) | null = null

    if(!cachedPost){
      post = await db.post.findFirst({
        where: {
            id: params.postId,
        },
        include: {
          votes: true,
          author: true,
        }
        })
  }
  if(!post && !cachedPost) return <NotFound/>
  return (
    <div>
      <div className="h-full flex flex-row justify-between sm:items-start">
     

        <div className="w-full sm:w-0 flex-1 bg-white p-4 rounded-sm">
          <p className="mt-1 truncate max-h-40 text-xs text-gray-500">
            Posted by l/{post?.author.username ?? cachedPost.authorUsername}{' '}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className="text-xl leading-6 py-2 text-gray-900 font-semibold">
            {post?.title ?? cachedPost.title}
          </h1>
          <EditorOutput content={post?.content ?? cachedPost.content} />
               
          <Suspense fallback={<PostVoteShell />}>
                {/* @ts-expect-error server component*/}
                <PostVoteServer postId={post?.id ?? cachedPost.id} getData={async () => {
                  return await db.post.findUnique({
                    where: {
                      id: params.postId
                    },
                    include: {
                      votes: true
                    }
                  })
                }}/>
                </Suspense>


          <Suspense fallback={<PostContentShell />}>
            {/* @ts-expect-error server components */}
            <CommentSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>

    </div>
  )
}


    function PostVoteShell() {
  return (
    <div className='flex items-center flex-col pr-6 w-20'>
      {/* upvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUp className='h-5 w-5 text-zinc-700' />
      </div>

      {/* score */}
      <div className='text-center py-2 font-medium text-sm text-zinc-900'>
        <Loader2 className='h-3 w-3 animate-spin' />
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDown className='h-5 w-5 text-zinc-700' />
      </div>
    </div>
  )
}
    function PostContentShell() {
  return (
    <div className='flex flex-col w-full'>
      <div className='relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl'>
        <Skeleton className='h-full w-full' />
      </div>
      <Skeleton className='mt-4 w-2/3 h-4 rounded-lg' />
      <Skeleton className='mt-2 w-16 h-4 rounded-lg' />
      <Skeleton className='mt-2 w-12 h-4 rounded-lg' />
    </div>
  )
}

export default page
