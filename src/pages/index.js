import Image from 'next/image'
import { Inter } from 'next/font/google'
import Header from '@/components/header'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      <Header />
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

        <h1 className="text-4xl sm:text-6xl font-bold text-white">Welcome to Lv1uP!!</h1>
        <p className="text-lg sm:text-2xl">Level up your skills and achieve greatness.</p>
      </div>
    </main>
  )
}
