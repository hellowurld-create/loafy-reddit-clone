"use client"

import { useCustomToasts } from "@/hooks/use-custom-toast"
import { cn } from "@/lib/utils"
import { usePrevious } from "@mantine/hooks"
import { VoteType } from "@prisma/client"
import { ArrowBigDown, ArrowBigUp } from "lucide-react"
import { FC, useEffect, useState } from "react"
import { Button } from "../ui/button"
import { useMutation } from "@tanstack/react-query"
import { PostVoteRequest } from "@/lib/validators/vote"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"

interface PostVoteClientProps{
    postId: string
    initialVotesAmt: number
    initialVote?: VoteType | null
}

const PostVoteClient: FC<PostVoteClientProps> = ({
    postId,
    initialVotesAmt,
    initialVote,

}) => {

    const { loginToast } = useCustomToasts()
    const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
    const [currentVote, setCurrentVote] = useState(initialVote)
    const prevVote = usePrevious(currentVote)

    useEffect(() => {
        setCurrentVote(initialVote)
    }, [initialVote])

    const {mutate: vote } = useMutation({
        mutationFn: async (voteType: VoteType) => {
            const payload: PostVoteRequest = {
                postId,
                voteType

            }

            await axios.patch('/api/subreddit/post/vote', payload)
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
        onMutate: (type: VoteType) => {
            if (currentVote === type) {
                setCurrentVote(undefined)
                if(type === 'UP') setVotesAmt((prev) => prev - 1)
                else if(type === 'DOWN') setVotesAmt((prev) => prev + 1)
            } else {
                setCurrentVote(type) 
                if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
                else if (type === 'DOWN') setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
            }
        }
    })

  return (
    <div className="flex sm:flex-row gap-2 pr-6 max-sm:pb-0 max-sm:pr-0 sm:w-20 pb-4 sm:pb-0">
          <Button onClick={()=> vote('UP')} size={'sm'} variant={'ghost'} className="rounded-full px-1 my-1 justify-center flex items-center hover:bg-slate-300 w-7 h-7" aria-label="upvote">
              <ArrowBigUp className={cn('h-5 w-5 text-zinc-700', {
                  'text-orange-400 fill-orange-400 hover:fill-orange-400' : currentVote === 'UP',
              })} />
          </Button>
          
          <p className="py-2 space-x-2 font-medium text-sm text-zinc-900">
              {votesAmt}
          </p>

          <Button onClick={() => vote('DOWN')} size={'sm'} variant={'ghost'} className="rounded-full px-1 my-1 justify-center flex items-center hover:bg-slate-300 w-7 h-7" aria-label="downvote">
              <ArrowBigDown className={cn('h-5 w-5 text-zinc-700', {
                  'text-red-400 fill-red-400' : currentVote === 'DOWN',
              })} />
          </Button>
    </div>
  )
}

export default PostVoteClient
