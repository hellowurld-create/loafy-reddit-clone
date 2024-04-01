"use client"

import { User } from "next-auth"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { FC } from "react"
import UserAvatar from "./UserAvatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"

interface UserAccountNavProps{
    user: Pick<User, 'name' | 'image' | 'email'>,
}

const UserAccountNav: FC<UserAccountNavProps>=({user}) => {
  return (
    <div>
          <DropdownMenu>
              <DropdownMenuTrigger>
                  <UserAvatar
                     className="h-8 w-8"
                      user={{
                      name: user.name || null,
                      image: user.image || null
                      }}
                  />
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="bg-white">
                  <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                          {user.name &&
                              <p className="font-medium">
                                  {user.name}
                              </p>
                          }
                          {user.email &&
                              <p className="w-[200px] truncate text-zinc-700 text-xs">
                                  {user.email}
                              </p>
                          }
                      </div>
                  </div>

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                      <Link href={'/'}>
                          Feed
                      </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                      <Link href={'/l/create'}>
                          Create community
                      </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                      <Link href={'/settings'}>
                          Settings
                      </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onSelect={(event) => {
                      event.preventDefault()
                      signOut({
                        callbackUrl: `${window.location.origin}/log-in`
                      })
                  }} className="hover:bg-slate-50 cursor-pointer">
                      Sign Out
                  </DropdownMenuItem>

              </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserAccountNav
