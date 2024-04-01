import Link from "next/link"
import { Icons } from "./Icons"
import { buttonVariants } from "./ui/button"
import { getAuthSession } from "@/lib/auth"
import UserAccountNav from "./UserAccountNav"
import SearchBar from "./SearchBar"
const Navbar = async () => {
  const session = await getAuthSession()

  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-slate-100 border-b border-zinc-300 z-[10] py-2">
          <div className="container max-w-7xl mx-auto flex items-center h-full justify-between gap-2">
              {/* app logo */}
              <Link href={'/'} className="flex gap-2 items-center">
          <Icons.logo className="h-10 w-10 sm:h-6 sm:w-6" />
          <p className="hidden text-xl text-zinc-700 font-medium md:block">
            Loafy
          </p>
        </Link>
        
        {/* search bar */}
        <SearchBar />

        {
          session?.user ? (
            <UserAccountNav user={session.user}/>
          ) :
            (
              <Link href={'/log-in'} className={buttonVariants()}>Log In</Link>
            )
        }
        </div>
    </div>
  )
}

export default Navbar
