'use client'

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { subscribeToSubredditPayload } from "@/lib/validators/subreddit";
import { FC, startTransition } from "react";
import axios, { AxiosError } from "axios";
import { useCustomToasts } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToogleProps{
    subredditId: string,
    subredditName: string,
    isSubscribed: boolean
}


const SubscribeLeaveToogle: FC<SubscribeLeaveToogleProps> = ({
    subredditId, subredditName, isSubscribed
}) => {
    const { loginToast } = useCustomToasts();
    const router = useRouter()

    const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
        mutationFn: async () => { 
            const payload: subscribeToSubredditPayload = {
                subredditId
            }

            const { data } = await axios.post('/api/subreddit/subscribe', payload)
            return data as string;
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
            })

            return toast({
                title: 'Subscribed',
                description: `You are now subscribed to l/${subredditName}`
            })
        },
    })
    const { mutate: unsubscribe, isLoading: isUnSubLoading } = useMutation({
        mutationFn: async () => { 
            const payload: subscribeToSubredditPayload = {
                subredditId
            }

            const { data } = await axios.post('/api/subreddit/unsubscribe', payload)
            return data as string;
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
            })

            return toast({
                title: 'Unsubscribed',
                description: `You are now unsubscribed to l/${subredditName}`
            })
        },
    })

    return isSubscribed ? (
    <Button className="w-full mt-1 mb-4" onClick={()=> unsubscribe()} isLoading={isUnSubLoading}>Leave community</Button>
    ): (
       <Button isLoading={isSubLoading} onClick={()=> subscribe()} className="w-full mt-1 mb-4">Join community</Button>     
    )
}

export default SubscribeLeaveToogle
