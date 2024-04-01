"use client"

import { useCustomToasts } from "@/hooks/use-custom-toast"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { CommentVoteRequest } from "@/lib/validators/vote"
import { usePrevious } from "@mantine/hooks"
import { CommentVote, VoteType } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { ArrowBigDown, ArrowBigUp } from "lucide-react"
import { FC, useState } from "react"
import { Button } from "./ui/button"

type PartialVote =  Pick<CommentVote, 'type'>

interface CommentVoteProps{
    commentId: string
    initialVotesAmt: number
    initialVote?: PartialVote
}

const CommentVotes: FC<CommentVoteProps> = ({
    commentId,
    initialVotesAmt,
    initialVote,

}) => {

    const { loginToast } = useCustomToasts()
    const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
    const [currentVote, setCurrentVote] = useState(initialVote)
    const prevVote = usePrevious(currentVote)

    const {mutate: vote } = useMutation({
        mutationFn: async (voteType: VoteType) => {
            const payload: CommentVoteRequest = {
                commentId,
                voteType
            }

            await axios.patch('/api/subreddit/post/comment/vote', payload)
        },
        onError: (err, voteType) => {
            if (voteType === 'UP') setVotesAmt((prev) => prev - 1)
            else setVotesAmt((prev) => prev + 1)
            
            //reset current votes
            setCurrentVote(prevVote)

            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'Something went wrong',
                description: 'Your vote was not registered, please try again. ',
                variant: 'destructive',
            })
        },
        onMutate: (type) => {
            if (currentVote?.type === type) {
                setCurrentVote(undefined)
                if(type === 'UP') setVotesAmt((prev) => prev - 1)
                else if(type === 'DOWN') setVotesAmt((prev) => prev + 1)
            } else {
                setCurrentVote({type}) 
                if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
                else if (type === 'DOWN') setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
            }
        }
    })

  return (
    <div className="flex sm:flex-row gap-1">
          <Button onClick={()=> vote('UP')} size={'sm'} variant={'ghost'} className="rounded-full px-1 my-1 justify-center flex items-center hover:bg-slate-300 w-7 h-7" aria-label="upvote">
              <ArrowBigUp className={cn('h-5 w-5 text-zinc-700', {
                  'text-orange-400 fill-orange-400 hover:fill-orange-400' : currentVote?.type === 'UP',
              })} />
          </Button>
          
          <p className="py-2 space-x-2 font-medium text-sm text-zinc-900">
              {votesAmt}
          </p>

          <Button onClick={() => vote('DOWN')} size={'sm'} variant={'ghost'} className="rounded-full px-1 my-1 justify-center flex items-center hover:bg-slate-300 w-7 h-7" aria-label="downvote">
              <ArrowBigDown className={cn('h-5 w-5 text-zinc-700', {
                  'text-red-400 fill-red-400' : currentVote?.type === 'DOWN',
              })} />
          </Button>
    </div>
  )
}

export default CommentVotes
