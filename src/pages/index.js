import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useStore, { initSocket, useSocketData } from '@/helpers/store'
import dynamic from 'next/dynamic'
import Go from '@/components/dom/go'

const Sphere = dynamic(() => import('@/components/canvas/Sphere'), {
  ssr: false,
})

const Page = () => {
  useStore.setState({ title: 'Sphere' })
  const router = useRouter()

  useEffect(() => {
    const w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0]
    const screenWidth = w.innerWidth || e.clientWidth || g.clientWidth
    // check if user is on mobile using screen width and user agent string
    const userIsOnMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) && screenWidth < 768 // screenWidth is in pixels
    // if user is on mobile, then redirect them to the controller view
    if (userIsOnMobile) {
      router.push(`/controller-view`)
    }
  }, [router])

  useEffect(() => {
    initSocket()
  }, [])

  const data = useSocketData()
  console.log(data)

  return (
    <>
      <Sphere r3f />
      <Go />
    </>
  )
}

export default Page
