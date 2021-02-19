import { Suspense } from 'react'
import { Environment, MeshDistortMaterial } from '@react-three/drei'
import { a, useSpring } from '@react-spring/three'
// import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'
import { extend } from 'react-three-fiber'
import useStore from '@/helpers/store'

// const M = a(MeshDistortMaterial)
// extend({ RoundedBoxGeometry })

const BoxComponent = (props) => {
  const router = useStore((s) => s.router)
  // const { color } = useSpring({
  //   color: router.route !== '/box' ? 'black' : '#272727',
  // })

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <mesh
        {...props}
        rotation={props.rotation || [0, 0, 0]}
        onClick={() => {
          router.push(`/`)
        }}
      >
        <roundedBoxGeometry args={[1.5, 1.5, 1.5, 10, 0.1]} />
        <meshStandardMaterial color={props.color || '#272727'} />
      </mesh>
      <Environment preset={'studio'} />
    </Suspense>
  )
}
export default BoxComponent
