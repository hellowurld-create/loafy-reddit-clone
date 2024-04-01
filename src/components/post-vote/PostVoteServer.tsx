import { Post, Vote } from "@prisma/client"
import { getServerSession } from "next-auth"
import NotFound from "../NotFound"
import PostVoteClient from "./PostVoteClient"

interface PostVoteServerProps {
  postId: string
  initialVotesAmt?: number
  initialVote?: Vote['type'] | null
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>
}

const PostVoteServer = async ({
  postId,
  initialVotesAmt,
  initialVote,
  getData,
}: PostVoteServerProps) => {
    
    const session = await getServerSession()

  let _votesAmt: number = 0
  let _currentVote: Vote['type'] | null | undefined = undefined

    if (getData) {
        const post = await getData()
        if (!post) return <NotFound />
        
       _votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1
      if (vote.type === 'DOWN') return acc - 1
      return acc
    }, 0)

       _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user?.id)?.type
  } else {
    // passed as props
    _votesAmt = initialVotesAmt!
    _currentVote = initialVote
    }

  return (
      <PostVoteClient postId={postId}
        initialVotesAmt={_votesAmt} initialVote={_currentVote} />
        
  )
}

export default PostVoteServer
