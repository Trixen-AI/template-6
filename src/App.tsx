import { Blog } from '@/components/sections/Blog'
import { Cta } from '@/components/sections/Cta'
import { Ecosystem } from '@/components/sections/Ecosystem'
import { Footer } from '@/components/sections/Footer'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { InPractice } from '@/components/sections/InPractice'
import { Mechanics } from '@/components/sections/Mechanics'
import { Partners } from '@/components/sections/Partners'
import { Strategies } from '@/components/sections/Strategies'
import { useBentoBorder } from '@/hooks/useBentoBorder'
import { useWebflowInteractions } from '@/hooks/useWebflowInteractions'

export default function App() {
  useWebflowInteractions()
  useBentoBorder()
  return (
    <div className="page-wrapper">
      <Header />
      <Hero />
      <Strategies />
      <Mechanics />
      <InPractice />
      <Ecosystem />
      <Partners />
      <Blog />
      <Cta />
      <Footer />
    </div>
  )
}
