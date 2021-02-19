import React, { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from 'react-three-fiber'
import { Physics, useSphere, useBox, usePlane } from '@react-three/cannon'
import create from 'zustand'
import lerp from 'lerp'
import { clamp } from 'lodash-es'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Text from '../components/canvas/Text'
import { useTexture } from '@react-three/drei'
import { useSocketData, initSocket, gameStore } from '@/helpers/store'

const cursor_xAxisPosition = (z) => {
  // computed using z euler angle
  let newZ = z
  newZ = newZ > 110 ? 110 : newZ
  newZ = newZ < 70 ? 70 : newZ
  newZ -= 70 // 40 > z > 0
  return 100 - Math.round((newZ / 40) * 100)
}
const cursor_yAxisPosition = (x) => {
  // computed using x
  let newX = x
  newX = newX > 20 ? 20 : newX
  newX = newX < -20 ? -20 : newX
  newX += 20 // 40 > z > 0
  // return 100 - Math.round((newX / 40) * 100)
  return 100 - Math.round((newX / 40) * 100)
}

function Paddle() {
  const ping = new Audio('/ping.mp3')
  const { nodes, materials } = useLoader(GLTFLoader, 'pingpong.glb')

  const setPing = gameStore((state) => state.setPing)
  const { pong } = gameStore((state) => state.api)
  const welcome = gameStore((state) => state.welcome)
  const count = gameStore((state) => state.count)

  const { x = 0, y = 0, z = 0 } = useSocketData((s) => s.eulerAngles)
  // detect if the user is pointing at the main display
  const userIsPointingAtScreen = () => {
    if (120 >= z && z >= 60 && 30 >= x && x >= -30) {
      return true
    }
    return false
  }

  const model = useRef()

  const [ref, api] = useBox(() => ({
    type: 'Kinematic',
    args: [1.7, 0.5, 1.75],
    onCollide: (e) => pong(e.contact.impactVelocity),
  }))

  let values = useRef([0, 0])
  console.log({
    ref,
    api,
    x,
    y,
    z,
    cursor_xAxisPosition: cursor_xAxisPosition(z),
    cursor_yAxisPosition: cursor_yAxisPosition(x),
  })

  setPing(ping)

  // from demo

  // useFrame(state => {
  //   // The paddle is kinematic (not subject to gravitation), we move it with the api returned by useBox
  //   values.current[0] = lerp(values.current[0], (state.mouse.x * Math.PI) / 5, 0.2)
  //   values.current[1] = lerp(values.current[1], (state.mouse.x * Math.PI) / 5, 0.2)
  //   api.position.set(state.mouse.x * 10, state.mouse.y * 5, 0)
  //   api.rotation.set(0, 0, values.current[1])
  //   // Left/right mouse movement rotates it a liitle for effect only
  //   model.current.rotation.x = lerp(model.current.rotation.x, welcome ? Math.PI / 2 : 0, 0.2)
  //   model.current.rotation.y = values.current[0]
  // })

  useFrame((state) => {
    values.current[0] = lerp(
      values.current[0],
      (cursor_xAxisPosition(z) * Math.PI) / 5,
      0.2
    )
    values.current[1] = lerp(
      values.current[1],
      (cursor_xAxisPosition(z) * Math.PI) / 5,
      0.2
    )

    api.position.set(cursor_xAxisPosition(z), cursor_yAxisPosition(x), 0)
    api.rotation.set(0, 0, values.current[1])

    model.current.rotation.x = lerp(
      model.current.rotation.x,
      welcome ? Math.PI / 2 : 0,
      0.2
    )

    model.current.rotation.y = values.current[0]
  })

  return (
    <mesh ref={ref} dispose={null}>
      <group
        ref={model}
        position={[-0.05, 0.37, 0.3]}
        scale={[0.15, 0.15, 0.15]}
      >
        <Text rotation={[-Math.PI / 2, 0, 0]} position={[0, 1, 2]} size={1}>
          {count.toString() || '0'}
        </Text>
        <group rotation={[1.88, -0.35, 2.32]} scale={[2.97, 2.97, 2.97]}>
          <primitive object={nodes.Bone} />
          <primitive object={nodes.Bone003} />
          <primitive object={nodes.Bone006} />
          <primitive object={nodes.Bone010} />
          <skinnedMesh
            castShadow
            receiveShadow
            material={materials.glove}
            material-roughness={1}
            geometry={nodes.arm.geometry}
            skeleton={nodes.arm.skeleton}
          />
        </group>
        <group rotation={[0, -0.04, 0]} scale={[141.94, 141.94, 141.94]}>
          <mesh
            castShadow
            receiveShadow
            material={materials.wood}
            // geometry={nodes.mesh_0.geometry}
          />
          <mesh
            castShadow
            receiveShadow
            material={materials.side}
            geometry={nodes.mesh_1.geometry}
          />
          <mesh
            castShadow
            receiveShadow
            material={materials.foam}
            geometry={nodes.mesh_2.geometry}
          />
          <mesh
            castShadow
            receiveShadow
            material={materials.lower}
            geometry={nodes.mesh_3.geometry}
          />
          <mesh
            castShadow
            receiveShadow
            material={materials.upper}
            geometry={nodes.mesh_4.geometry}
          />
        </group>
      </group>
    </mesh>
  )
}

function Ball() {
  const map = useTexture('cross.jpg')
  const [ref] = useSphere(() => ({ mass: 1, args: 0.5, position: [0, 5, 0] }))
  return (
    <mesh castShadow ref={ref}>
      <sphereBufferGeometry attach='geometry' args={[0.5, 64, 64]} />
      <meshStandardMaterial attach='material' map={map} />
    </mesh>
  )
}

function ContactGround() {
  const { reset } = gameStore((state) => state.api)
  const [ref] = usePlane(() => ({
    type: 'Static',
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -10, 0],
    onCollide: () => reset(true),
  }))
  return <mesh ref={ref} />
}

export default function Page() {
  const welcome = gameStore((state) => state.welcome)
  const { reset } = gameStore((state) => state.api)
  useEffect(() => {
    initSocket()
  }, [])
  const currentRoom = useSocketData((s) => s.currentRoom)
  console.log({ currentRoom })

  return (
    <>
      <Canvas
        shadowMap
        sRGB
        camera={{ position: [0, 5, 12], fov: 50 }}
        onClick={() => welcome && reset(false)}
      >
        <color attach='background' args={['#171720']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[-10, -10, -10]} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <mesh position={[0, 0, -10]} receiveShadow>
          <planeBufferGeometry attach='geometry' args={[1000, 1000]} />
          <meshPhongMaterial attach='material' color='#172017' />
        </mesh>
        <Physics
          iterations={20}
          tolerance={0.0001}
          defaultContactMaterial={{
            friction: 0.9,
            restitution: 0.7,
            contactEquationStiffness: 1e7,
            contactEquationRelaxation: 1,
            frictionEquationStiffness: 1e7,
            frictionEquationRelaxation: 2,
          }}
          gravity={[0, -40, 0]}
          allowSleep={false}
        >
          <ContactGround />
          {!welcome && <Ball />}
          <Suspense fallback={null}>
            <Paddle />
          </Suspense>
        </Physics>
      </Canvas>

      <p
        style={{
          position: 'absolute',
          top: 25,
          left: 50,
          color: 'white',
          fontSize: '1.2em',
        }}
      >
        Room: {currentRoom}
      </p>

      <div
        style={{
          position: 'absolute',
          display: welcome ? 'block' : 'none',
          top: 50,
          left: 50,
          color: 'white',
          fontSize: '1.2em',
        }}
      >
        * click to start ...
      </div>
    </>
  )
}
