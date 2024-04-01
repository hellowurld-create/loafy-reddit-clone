'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Prisma, Subreddit } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import debounce from 'lodash.debounce'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'

const SearchBar = () => {
    const [input, setInput] = useState<string>('')


    const {data: queryResults, refetch, isFetched, isFetching } = useQuery({

        queryFn: async () => {
            if (!input) return []
            const { data } = await axios.get(`/api/search?q=${input}`)
            return data as (Subreddit & {
                _count: Prisma.SubredditCountOutputType
            })[]
        }, queryKey: ['search-query'],
        enabled: false,
    })

    const request = debounce(async()=>{
        refetch()
    }, 300)

     const debounceRequest = useCallback(() => {
        request()
    },[])

    const router = useRouter()
    const commandRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()

    useOnClickOutside(commandRef, () => {
        setInput('')
    })

    useEffect(() => {
       setInput('') 
    },[pathname])

  return (
    <Command ref={commandRef} className='relative rounded-lg border max-w-lg z-50 overflow-visible'>
          <CommandInput value={input} onValueChange={(text) => {
              setInput(text)
              debounceRequest()
          }}
            placeholder='Search communities'
            className='outline-none border-none focus:border-none ring-0 focus-within:outline-none' />
          {
              input.length > 0 ? (
                <CommandList className='absolute bg-white top-full inset-x-0 rounded-b-md'>
                      {
                          isFetched && <CommandEmpty>No result found.</CommandEmpty>
                      } 
                      {(queryResults?.length ?? 0) > 0 ? (
                          <CommandGroup heading='communities'>
                              {
                                  queryResults?.map((subreddit) => (
                                      <CommandItem key={subreddit.id}
                                          value={subreddit.name}
                                          onSelect={(e) => {
                                          router.push(`/l/${e}`)
                                          router.refresh()
                                          }}>
                                          <Users className='h-4 w-4 mr-2' />
                                          <a href={`/l/${subreddit.name}`}>
                                              l/{subreddit.name}
                                          </a>
                                     </CommandItem> 
                                  ))
                              }
                          </CommandGroup>
                      ): null}
                </CommandList>
              ):null
          }
    </Command>
  )
}

export default SearchBar
