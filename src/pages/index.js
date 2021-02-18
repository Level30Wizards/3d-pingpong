import { useEffect } from 'react'
import useStore, { initSocket, useSocketData } from '@/helpers/store'
import dynamic from 'next/dynamic'
import Go from '@/components/dom/go'
import { a, useSpring } from '@react-spring/three'

const Sphere = dynamic(() => import('@/components/canvas/Sphere'), {
  ssr: false,
})

const Page = () => {
  useStore.setState({ title: 'Sphere' })
  const router = useStore((s) => s.router)

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

  const currentRoom = useSocketData((s) => s.currentRoom)
  console.log(currentRoom)

  const { ax, ay, az } = useSocketData((s) => s.acceleration)
  const { x, y, z } = useSocketData((s) => s.eulerAngles)
  const cursor_xAxisPosition = () => {
    // computed using z euler angle
    let newZ = z
    newZ = newZ > 110 ? 110 : newZ
    newZ = newZ < 70 ? 70 : newZ
    newZ -= 70 // 40 > z > 0
    return 100 - Math.round((newZ / 40) * 100)
  }
  const cursor_yAxisPosition = () => {
    // computed using x
    let newX = x
    newX = newX > 20 ? 20 : newX
    newX = newX < -20 ? -20 : newX
    newX += 20 // 40 > z > 0
    // return 100 - Math.round((newX / 40) * 100)
    return 100 - Math.round((newX / 40) * 100)
  }

  // detect if the user is pointing at the main display
  const userIsPointingAtScreen = () => {
    if (120 >= z && z >= 60 && 30 >= x && x >= -30) {
      return true
    }
    return false
  }

  const cursor_zAxisPosition = () => {
    // computed using y
    let newY = y
    newY = newY > 20 ? 20 : newY
    newY = newY < -20 ? -20 : newY
    newY += 20 // 40 > z > 0
    // return 100 - Math.round((newY / 40) * 100)
    return Math.round(newY / 40)
  }

  const { color } = useSpring({
    color: userIsPointingAtScreen() ? '#272727' : 'black',
  })
  const { rx, ry, rz } = useSpring({
    rx: x > 0 ? x / 10 : x,
    ry: y > 0 ? y / 10 : y,
    rz: z > 0 ? z / 10 : z,
  })

  console.log({
    position: [
      cursor_xAxisPosition(),
      cursor_yAxisPosition(),
      cursor_zAxisPosition(),
    ],
    rotation: [rx, ry, rz],
  })

  // const threshold = 12;
  // if (
  //   Math.abs(this.acceleration.x) > threshold ||
  //   Math.abs(this.acceleration.y) > threshold ||
  //   Math.abs(this.acceleration.z) > threshold
  // ) {
  //   return true;
  // }
  // return false;

  return (
    <>
      <p>{currentRoom}</p>
      <Sphere
        r3f
        color={color}
        position={
          ax || ay || az
            ? [
                cursor_xAxisPosition(),
                cursor_yAxisPosition(),
                cursor_zAxisPosition(),
              ]
            : undefined
        }
        rotation={rx || ry || rz ? [rx, ry, rz] : undefined}
      />
      <Go />
    </>
  )
}

export default Page
