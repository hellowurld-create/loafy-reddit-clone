import Editor from "@/components/Editor"
import NotFound from "@/components/NotFound"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"

interface PageProps{
    params: {
        slug: string
    }
}

const page = async({ params }: PageProps) => {
    const subreddit  = await db.subreddit.findFirst({
        where: {
            name: params.slug,
        }
    })

    if (!subreddit) {
        return <NotFound/>
    }
  return (
    <div className="flex flex-col items-start gap-6">
          <div className="border-b border-slate-200 pb-5">
              <div className="flex flex-wrap flex-col items-baseline -ml-2 mt-2">
                  <h3 className="text-base ml-2 mt-2 font-semibold leading-6 text-slate-900">
                      Create Post
                  </h3>
                  <p className="truncate text-slate-500 ml-2 mt-1 text-sm">
                      in l/{params.slug}
                  </p>
              </div>
          </div>
          
          {/* create post form */}
          <Editor subredditId={ subreddit.id } />
          
          <div className="w-full flex justify-end">
              <Button type="submit" className="w-full" form="subreddit-post-form">
                  Post
              </Button>
          </div>
    </div>
  )
}

export default page
