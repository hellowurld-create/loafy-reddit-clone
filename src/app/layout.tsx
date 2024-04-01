import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import { Montserrat } from 'next/font/google'


export const metadata = {
  title: 'Loafy',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const montserrat = Montserrat({
  subsets: ['latin']
})

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html lang='en'
      className={cn(
        'bg-white light text-slate-900 antialiased',
        montserrat.className)}>
      <body className='min-h-screen pt-12 bg-slate-50 antialiased'>
        <Providers>

        <Toaster />
        {/*@ts-expect-error server component */}
        <Navbar />
        {authModal}
        <div className='max-w-7xl container mx-auto h-full pt-12'>
          {children}
          </div>
          
        </Providers>
      </body>
    </html>
  )
}
