'use client'

import { formatTimeToNow } from "@/lib/utils"
import { Comment, CommentVote, User } from "@prisma/client"
import { useRef, useState } from "react"
import UserAvatar from "./UserAvatar"
import CommentVotes from "./CommentVotes"
import { Button } from "./ui/button"
import { MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { useMutation } from "@tanstack/react-query"
import { CommentRequest } from "@/lib/validators/comment"
import axios from "axios"
import { toast } from "@/hooks/use-toast"

type ExtendedComment = Comment & {
    votes: CommentVote[]
    author: User
}


interface PostCommentProps{
    comment: ExtendedComment
    currentVote: CommentVote | undefined
    votesAmt: number
    postId: string
}

const PostComment = ({comment, votesAmt, currentVote, postId}: PostCommentProps) => {
    const commentRef = useRef<HTMLDivElement>(null)
    const router = useRouter();
    const { data: session } = useSession();
    const [isReplying, setIsReplying] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')

    const { mutate: postComment, isLoading } = useMutation({
        mutationFn: async ({postId, text, replyToId}: CommentRequest) => {
            const payload: CommentRequest = {
                postId, 
                text, 
                replyToId
            }

            const { data } = await axios.patch(`/api/subreddit/post/comment`, payload)
            return data
        },
        onError: () => {
            return toast({
                title: 'Something went wrong',
                description: 'Comment was not posted successfully, please try again.',
                variant: 'destructive',
            }
            )
        },
        onSuccess: () => {
            router.refresh()
            setIsReplying(false)
        },

    })

  return (
      <div ref={commentRef} className="flex flex-col">
          <div className="flex items-center">
              
          <UserAvatar
              user={{
                  name: comment.author.name || null,
                  image: comment.author.image || null
                }}
                className="h-6 w-6"
                />
          <div className="ml-2 flex items-center gap-x-2">
              <p className="text-sm font-medium text-gray-900">
                  l/{comment.author.username}
              </p>
              <p className="text-xs max-h-40 truncate text-zinc-500">
                  {formatTimeToNow(new Date(comment.createdAt) )}
              </p>
              </div>
    </div>
          <p className="text-sm text-zinc-900 mt-2 mb-4">{comment.text}</p>
          <hr className="w-full"/>
          <div className="items-center pt-2 flex-wrap gap-2 flex">
              <CommentVotes commentId={comment.id}
                  initialVote={currentVote} initialVotesAmt={votesAmt} />
              
              <Button onClick={() => {
                  if (!session) return router.push('/sign-in')
                  setIsReplying(true)
              }} variant='ghost' size={'sm'} aria-label="reply">
                  <MessageSquare className="h-4 w-4 mr-1.5"/>
                  Reply
              </Button>

              {isReplying ? 
                  (
                <div className='grid w-full gap-1.5'>
          <Label htmlFor='comment'></Label>
          <Textarea id='comment' value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder='What are your thoughts?'
          />

            <div className="flex justify-end gap-2 mt-2">
            <Button tabIndex={-1} variant={'ghost'} onClick={()=> setIsReplying(false)}>Cancel</Button>            
            <Button isLoading={isLoading} disabled={input.length === 0} onClick={() => {
               if (!input) return
                postComment({
                postId,
                text: input,
                replyToId: comment.replyToId ?? comment.id, 
               })                  
              }}>Post</Button>
          </div>
    </div>
                  )
              : null}
          </div>


</div>
  )
}

export default PostComment
