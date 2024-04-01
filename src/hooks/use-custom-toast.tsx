import Link from "next/link"
import { toast } from "./use-toast"
import { buttonVariants } from "@/components/ui/button"

export const useCustomToasts = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: 'Login required.',
      description: 'Please login to use this feature',
      variant: 'destructive',
      action: (
        <Link
          onClick={() => dismiss()}
          href='/log-in'
          style={{ color: 'black' }}    
          className={buttonVariants({ variant: 'outline'  })}>
          Login
        </Link>
      ),
    })
  }

  return { loginToast }
}