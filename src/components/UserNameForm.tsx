"use client"

import { usernameRequest, usernameValidator } from "@/lib/validators/username"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface UserNameFormProps{
    user: Pick<User, 'id' | 'username'>
}

const UserNameForm = ({ user }: UserNameFormProps) => {
    const router = useRouter()

    const { 
        handleSubmit,
        register,
        formState: {errors},
     } = useForm<usernameRequest>({
        resolver: zodResolver(usernameValidator),
        defaultValues: {
            name: user?.username || ''
        }
     })
    
    const { mutate: updateUsername, isLoading } = useMutation({
        mutationFn: async ({name}: usernameRequest) => {
            const payload: usernameRequest = { name }
            
            const { data } = await axios.patch(`/api/username`, payload)
            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: 'Username already taken.',
                        description: 'Please choose a different username.',
                        variant: 'destructive',
                    })
                }
            }
                
           return toast({
                title: 'There was an error',
                description: 'Could not make a loaf',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            toast({
                description: 'Your username has been updated.'
            })
            router.refresh()
        }
        })
    
  return (
      <form onSubmit={handleSubmit((e) => updateUsername(e))}>
        <Card>
              <CardHeader>
                  <CardTitle>
                   Please enter a display name for your account.   
                </CardTitle>
              </CardHeader> 
              <CardContent>
                  <div className="relative grid gap-1">
                      <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
                      <span className="text-sm text-zinc-400">u/</span>
                      </div> 
                      <Label className="sr-only" htmlFor="name">Username</Label>
                      <Input id="name" className="w-[400px] pl-6" size={32} {...register('name')} />
                      {
                          errors?.name && (
                              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
                          )
                      }
                  </div>
              </CardContent>

              <CardFooter>
                 <Button isLoading={isLoading}>Change Username</Button> 
              </CardFooter>

      </Card>
    </form>
  )
}

export default UserNameForm
