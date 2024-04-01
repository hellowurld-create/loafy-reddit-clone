import CustomFeed from "@/components/CustomFeed";
import GeneralFeed from "@/components/GeneralFeed";
import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { LucideHome } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Home() {
  const session = await getAuthSession()

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Your feeds</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* @ts-expect-error server component */}
        {session ? <CustomFeed /> : <GeneralFeed />}
        
        {/* feed info */}

        <div className="h-fit overflow-hidden rounded-lg border border-gray-200 order-first md:order-last">
          <div className="bg-slate-100 px-6 py-4">
            <p className="flex items-center gap-1.5 py-3 font-semibold">
              <LucideHome className="w-4 h-4"/>
              Home
            </p>
          </div>
          <div className="-my-3 divide-y divide-gray-300 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal loafy homepage. Explore all your favorite communities and interact with friends.
              </p>
            </div>
            <Link href={'/l/create'} className={buttonVariants({
                className: 'w-full mt-4 mb-6'
            })}
            >
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
