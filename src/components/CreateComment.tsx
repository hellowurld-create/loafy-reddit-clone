'use client'

import { useCustomToasts } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { CommentRequest } from '@/lib/validators/comment'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React, { startTransition, useState } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

interface CreateCommentProps{
    postId: string
    replyToId?: string
}

const CreateComment = ({postId, replyToId}: CreateCommentProps) => {
    const [input, setInput] = useState<string>('')
    const { loginToast } = useCustomToasts();
    const router = useRouter();

    const { mutate: comment, isLoading } = useMutation({
        mutationFn: async ({ postId, text,
         replyToId}: CommentRequest) => {
            const payload: CommentRequest = {
                postId,
                text,
                replyToId,
            } 
            
            const { data } = await axios.patch(`/api/subreddit/post/comment`, payload)
            return data;
        },
        onError: (err) => {
             if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'There was a problem',
                description: 'Something went wrong, please try again',
                variant: 'destructive'
            })
        },
         onSuccess: () => {
            startTransition(() => {
                router.refresh()
                setInput('');
            })
        },
    })
  return (
    <div className='grid w-full gap-1.5'>
          <Label htmlFor='comment'></Label>
          <Textarea id='comment' value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder='What are your thoughts?'
          />

          <div className="flex justify-end mt-2">
              <Button isLoading={isLoading} disabled={input.length === 0} onClick={()=> comment({postId, text:input, replyToId}) }>Post</Button>
          </div>
    </div>
  )
}

export default CreateComment
