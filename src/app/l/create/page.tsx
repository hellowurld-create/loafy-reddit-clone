'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { CreateSubredditPayload } from "@/lib/validators/subreddit"
import { toast } from "@/hooks/use-toast"
import { useCustomToasts } from "@/hooks/use-custom-toast"

const Page = () => {
    const [input, setInput] = useState<string>('')

    const router = useRouter()
    const {loginToast} = useCustomToasts()

    const { mutate: createCommunity, isLoading } = useMutation({
        mutationFn: async () => {
            const payload : CreateSubredditPayload = {
                name: input,
            }

            const { data } = await axios.post('/api/subreddit', payload)
            return data as string
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: 'Loaf already exists.',
                        description: 'Please choose a different loaf name.',
                        variant: 'destructive',
                   })
                }
                
                if (err.response?.status === 422) {
                    return toast({
                        title: 'Invalid loaf name.',
                        description: 'Please choose a name between 3 and 21 characters.',
                        variant: 'destructive',
                   })
                }
                
                if (err.response?.status === 401) {
                    return loginToast()
               }
            }
            toast({
                title: 'There was an error',
                description: 'Could not make a loaf',
                variant: 'destructive'
            })
        },
        onSuccess: (data) => {
            router.push(`/l/${data}`)
        }

    })
  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
        <div className="relative h-fit rounded-md bg-white p-4 space-y-6">
              <div className="flex justify-between items-center">
                  <h1 className="text-xl font-semibold">Create a community</h1>
              </div>
              
              <hr className="bg-zinc-500 h-px" />
              
              <div>
                  <p className="font-medium text-lg">
                     Name 
                  </p>
                  <p className="pb-2 text-xs">
                      Community names including capitalization cannot be changed.
                  </p>

                  <div className="relative">
                      <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
                          l/
                      </p>
                      <Input value={input}
                          onChange={(e) => setInput(e.target.value)}  className="pl-6 border-black focus:border-gray-500"/>
                  </div>
              </div>
              <div className="flex justify-end gap-4">
                  <Button variant={'ghost'} className="border-black border" onClick={()=> router.back()}>Cancel</Button>
                  <Button onClick={() => createCommunity()}
                    disabled={input.length === 0} isLoading={isLoading}>Create a community</Button>
              </div>
        </div>
    </div>
  )
}

export default Page
