import { Suspense } from 'react'
import { Environment, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { a, useSpring } from '@react-spring/three'
import useStore, { useSocketData } from '@/helpers/store'

const M = a(MeshDistortMaterial)

const SphereComponent = () => {
  const router = useStore((s) => s.router)
  const { color } = useSpring({
    color: router.route === '/box' ? '#272727' : 'black',
  })

  const eulerAngles = useSocketData((s) => s.eulerAngles)
  const { x, y, z } = eulerAngles

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <Sphere
        args={[1, 32, 32]}
        position={x ? [x, y, z] : undefined}
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
