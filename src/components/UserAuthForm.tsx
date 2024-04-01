'use client'


import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { signIn } from 'next-auth/react';
import { FC, useState } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/button";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    
}
 
const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
    const { toast } = useToast();
    
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
   

    const loginWithGoogle = async () => {
        setIsGoogleLoading(true);

        try {
            await signIn('google')
        } catch (error) {
            // send toast notification
            toast({
                title: 'There was a problem.',
                description: 'There was an error logging in with Google',
                variant: 'destructive'
            })
        } finally {
            setIsGoogleLoading(false)
        }
    }

    return ( 
        <>
        <div className={cn('flex justify-center', className)} {...props}>
                <Button
                    isLoading={isGoogleLoading}
                    onClick={loginWithGoogle}
                    size={'sm'} className="w-full">
                    {isGoogleLoading ? null : <Icons.google className="h-4 w-4 mr-2"/>}
                    Google
                    </Button>
        </div>
        </>
     );
}
 
export default UserAuthForm;