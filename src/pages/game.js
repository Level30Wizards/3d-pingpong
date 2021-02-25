import React, { useState, Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from 'react-three-fiber'
import { Physics, useSphere, useBox, usePlane } from '@react-three/cannon'
import lerp from 'lerp'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Text from '../components/canvas/Text'
import { useTexture } from '@react-three/drei'
import { useSocketData, initSocket, gameStore } from '@/helpers/store'
import { useWindowSize } from 'react-use'

function rescale(from_min, from_max, to_min, to_max, from) {
  return (
    to_min + (to_max - to_min) * ((from_min - from) / (from_min - from_max))
  )
}
rescale.clamped = function (from_min, from_max, to_min, to_max, from) {
  from = this(from_min, from_max, to_min, to_max, from)
  if (to_min < to_max) {
    if (from < to_min) return to_min
    else if (from > to_max) return to_max
  } else {
    if (from < to_max) return to_max
    else if (from > to_min) return to_min
  }
  return from
}

const cursor_xAxisPosition = (z, SENSITIVITY) => {
  if (typeof window === 'undefined' || z === 0) return 0
  // computed using z euler angle, 0 to 360
  let newZ = z

  newZ = newZ > 180 ? 180 : newZ // this is overswing to the left
  newZ = newZ > 270 ? 0 : newZ //this is overswing to the right

  /**
   * if newZ is 90 it should return 0
   * if newZ is 0 it should return 10
   * if newZ is 180 it should return -10
   */

  return rescale.clamped(0, 180, 10, -10, newZ) * SENSITIVITY
}
const cursor_yAxisPosition = (x, SENSITIVITY) => {
  if (typeof window === 'undefined' || x === 0) return 0
  // computed using x, -180 to 180
  let newX = x + 180

  // computed using x, 0 to 360
  // 180 is pointing at screen
  newX = newX > 270 ? 270 : newX // this is overswing up
  newX = newX < 90 ? 90 : newX //this is overswing down

  /**
   * if newX is 90 it should return 0
   * if newX is 0 it should return 10
   * if newX is 180 it should return -10
   */

  return rescale.clamped(90, 270, -10, 10, newX) * SENSITIVITY
}

// detect if the user is pointing at the main display
const userIsPointingAtScreen = (z, x) => {
  if (120 >= z && z >= 60 && 30 >= x && x >= -30) {
    return true
  }
  return false
}

function Paddle({ x, y, z, SENSITIVITY }) {
  const ping = new Audio('/ping.mp3')
  const { nodes, materials } = useLoader(GLTFLoader, 'pingpong.glb')

  const setPing = gameStore((state) => state.setPing)
  const { pong } = gameStore((state) => state.api)
  const welcome = gameStore((state) => state.welcome)
  const count = gameStore((state) => state.count)

  const model = useRef()

  const [ref, api] = useBox(() => ({
    type: 'Kinematic',
    args: [1.7, 0.5, 1.75],
    onCollide: (e) => pong(e.contact.impactVelocity),
  }))

  let values = useRef([0, 0])

  setPing(ping)

  useFrame((state) => {
    values.current[0] = lerp(values.current[0], ((y / 90) * Math.PI) / 5, 0.2)
    values.current[1] = lerp(values.current[1], ((y / 90) * Math.PI) / 5, 0.2)

    api.position.set(
      cursor_xAxisPosition(z, SENSITIVITY),
      cursor_yAxisPosition(x, SENSITIVITY),
      0
    )
    api.rotation.set(0, 0, values.current[1])

    if (model.current && model.current.rotation) {
      model.current.rotation.x = lerp(
        model.current.rotation.x,
        welcome ? Math.PI / 2 : 0,
        0.2
      )

      model.current.rotation.y = values.current[0]
    }
  })

  return (
    <mesh ref={ref} dispose={null}>
      <group
        ref={model}
        position={[-0.05, 0.37, 0.3]}
        scale={[0.15, 0.15, 0.15]}
      >
        <Text rotation={[-Math.PI / 2, 0, 0]} position={[0, 1, 2]} size={1}>
          {String(count)}
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

  const currentRoom = useSocketData((s) => s.currentRoom)
  // const setEulerAngles = useSocketData((s) => s.setEulerAngles)

  const eulerAngles = useSocketData((s) => s.eulerAngles)

  const { x, y, z } = eulerAngles || { x: 1, y: 1, z: 1 }

  const [SENSITIVITY, setSensitivity] = useState(2)

  useEffect(() => {
    initSocket()
  }, [])

  // for local testing
  // useEffect(() => {
  //   const setEulerValue = (e) => {
  //     setEulerAngles({
  //       x: Math.round(e.beta),
  //       y: Math.round(e.gamma),
  //       z: Math.round(e.alpha),
  //     })
  //   }
  //   if (
  //     typeof window !== 'undefined' &&
  //     window.location.href.includes('localhost')
  //   ) {
  //     console.log('you are testing')
  //     window.addEventListener('deviceorientation', setEulerValue)

  //     return () =>
  //       window.removeEventListener('deviceorientation', setEulerValue)
  //   }
  // }, [])

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
            <Paddle x={x} y={y} z={z} SENSITIVITY={SENSITIVITY} />
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
        <br />
        Coordinates (x, y, z): {x}, {y}, {z}
      </p>
      <div
        style={{
          position: 'absolute',
          borderRadius: '50%',
          top: `${50 + cursor_xAxisPosition(z, SENSITIVITY) * 5}%`,
          left: `${50 + cursor_yAxisPosition(x, SENSITIVITY) * 5}%`,
          transition: 'top 16ms ease-out, left 16ms ease-out',
          backgroundColor: userIsPointingAtScreen(z, x) ? 'blue' : 'red',
          width: '16px',
          height: '16px',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          display: welcome ? 'block' : 'none',
          top: 80,
          left: 50,
          color: 'white',
          fontSize: '1.2em',
        }}
      >
        * click to start ...
      </div>
      {/* <div
        style={{
          position: 'absolute',
          top: 50,
          right: 50,
          color: 'white',
          fontSize: '1.2em',
        }}
      >
        Change sensitivity
        <input
          style={{
            color: 'black',
            fontSize: '1.5rem',
          }}
          type='number'
          defaultValue={2}
          onChange={(e) => {
            setSensitivity(Number(e.target.value))
          }}
        />
      </div> */}
    </>
  )
}
