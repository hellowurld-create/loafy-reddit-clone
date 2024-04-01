import { formatTimeToNow } from '@/lib/utils'
import { Post, User, Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import React, { FC, useRef } from 'react'
import EditorOutput from './EditorOutput'
import UserAvatar from './UserAvatar'
import PostVoteClient from './post-vote/PostVoteClient'

type PartialVote = Pick<Vote, 'type'>

interface PostProps{
    subredditName: string
    post: Post & {
        author: User
        votes: Vote[]
    }
    commentAmt: number
    votesAmt: number
    currentVote?: PartialVote
}

const Post: FC<PostProps> = ({ subredditName, post, commentAmt, votesAmt, currentVote }) => {
    const pRef = useRef<HTMLDivElement>(null)
  return (
      <div className='rounded-md bg-white shadow'>
          <div className="flex px-6 justify-between py-4">
              {/* TODO: PostVotes */}

              <div className="flex-1 flex-col w-0">
                  <div className="text-xs flex items-center gap-3 max-h-40 mt-1 text-gray-500">
                     <UserAvatar
              user={{
                  name: post.author.name || null,
                  image: post.author.image || null
                }}
                className="h-6 w-6"
                />
                      <div className="flex flex-col">
                    <div className="flex">
                      <span className='font-semibold'>l/{subredditName}</span>
                       <span className='space-x-2 w-5 h-5'></span>
                      {formatTimeToNow(new Date(post.createdAt))}
                        </div>
                      <span>Posted by u/{post.author.username}</span>
                      </div>
                  </div>

                  <a href={`/l/${subredditName}/post/${post.id}`}>
                      <h1 className="text-base font-semibold py-2 leading-6 text-gray-900">
                          {post.title}
                      </h1>
                  </a>

                  <div className="relative text-sm max-h-40 overflow-clip w-full" ref={pRef}>
                      <EditorOutput content={post.content} />
                      {pRef.current?.clientHeight === 160 ? (
                          <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent'/>
                      ): null}
                  </div>
              </div>
          </div>
      
          <div className="z-20 bg-gray-50 flex flex-row text-sm p-4 gap-4 sm:px-6">
              <a className='w-fit bg-gray-200 px-3 rounded-3xl hover:bg-gray-100 flex items-center gap-2' href={`/l/${subredditName}/post/${post.id}`}>
                     <MessageSquare aria-label='comments' className='h-4 w-4'/><p className='font-semibold text-xs'>{commentAmt}</p>
                  </a>
                
              <div className='w-fit bg-gray-200  px-2 rounded-3xl hover:bg-gray-100 flex items-center justify-center gap-2'>
                     <PostVoteClient postId={post.id} initialVote={currentVote?.type} initialVotesAmt={votesAmt}/>
                  </div>
                
          </div>
    </div>
  )
}

export default Post
