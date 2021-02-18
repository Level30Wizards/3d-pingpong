import { Suspense } from 'react'
import { Environment, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { a, useSpring } from '@react-spring/three'
import useStore, { useSocketData } from '@/helpers/store'
import React from 'react'

// const M = a(MeshDistortMaterial)

const SphereComponent = (props, { color }) => {
  const router = useStore((s) => s.router)
  console.log(props, color)
  // {/* The X axis is red. The Y axis is green. The Z axis is blue. */}

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <Sphere
        {...props}
        color={color}
        args={[1, 32, 32]}
        // onClick={() => {
        //   router.push(`/box`)
        // }}
      >
        {/* <M factor={2} color={color} /> */}
      </Sphere>
      <Environment preset={'studio'} />
    </Suspense>
  )
}

export default SphereComponent
