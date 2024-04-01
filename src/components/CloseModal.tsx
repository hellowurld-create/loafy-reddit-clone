'use client'

import { X } from "lucide-react"
import { Button } from "./ui/button"
import {useRouter} from 'next/navigation'

const CloseModal = () => {
    const router = useRouter()

  return (
      <Button onClick={()=> router.back()} aria-label='close modal'
          className="h-6 w-6 p-0 cursor-pointer rounded-lg" variant={'ghost'}>
      <X className="h-4 w-4"/>
    </Button>
  )
}

export default CloseModal
