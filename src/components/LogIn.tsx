
import Link from "next/link"
import { Icons } from "./Icons"
import UserAuthForm from "./UserAuthForm"

const LogIn = () => {
  return (
    <div className="container mx-auto flex flex-col w-full justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
              <Icons.logo className="mx-auto h-6 w-6" />
              <h1 className="font-semibold text-2xl tracking-tight">
                  Welcome back!
              </h1>
              <p className="text-sm max-w-xs mx-auto">
                  By continuing, you are setting up a loafy account
                  and agree to our User Agreement and Privacy Policy.
              </p>

              {/* sign in form */}
              <UserAuthForm />

              <p className="px-8 text-center text-sm text-zinc-700">
                  New to Loafy? {' '}
                  <Link href={'/register'}
                      className="text-sm hover:text-zinc-800 underline underline-offset-4">
                      Register
                  </Link>
              </p>
      </div>
    </div>
  )
}

export default LogIn
