import { Suspense } from 'react'
import { Environment, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { a, useSpring } from '@react-spring/three'
import useStore, { useSocketData } from '@/helpers/store'

const M = a(MeshDistortMaterial)

const SphereComponent = () => {
  const router = useStore((s) => s.router)

  const { x, y, z } = useSocketData((s) => s.eulerAngles)
  // const { x, y, z } = eulerAngles
  const { ax, ay, az } = useSocketData((s) => s.acceleration)
  // const { ax, ay, az } = acceleration

  const cursor_xAxisPosition = () => {
    // computed using z
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
    return 100 - Math.round((newX / 40) * 100)
  }
  const cursor_zAxisPosition = () => {
    // computed using y
    let newY = y
    newY = newY > 20 ? 20 : newY
    newY = newY < -20 ? -20 : newY
    newY += 20 // 40 > z > 0
    return 100 - Math.round((newY / 40) * 100)
  }
  // detect if the user is pointing at the main display
  const userIsPointingAtScreen = () => {
    if (120 >= z && z >= 60 && 30 >= x && x >= -30) {
      return true
    }
    return false
  }

  const { color } = useSpring({
    color: userIsPointingAtScreen() ? '#272727' : 'black',
  })
  const { rx, ry, rz } = useSpring({
    rx: x / 10,
    ry: y / 10,
    rz: z / 10,
  })

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <Sphere
        args={[1, 32, 32]}
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
        onClick={() => {
          router.push(`/box`)
        }}
      >
        <M factor={2} color={color} />
      </Sphere>
      <Environment preset={'studio'} />
    </Suspense>
  )
}

export default SphereComponent
