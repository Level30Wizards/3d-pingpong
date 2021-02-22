import { useState, useRef } from 'react'
import useStore, { useSocketData } from '@/helpers/store'
import dynamic from 'next/dynamic'
import { useSpring } from '@react-spring/three'
import React from 'react'
import { useRafLoop } from 'react-use'

const Box = dynamic(() => import('@/components/canvas/Box'), {
  ssr: false,
})

// This page is for the user's controller (a smartphone).
// This is what the user will see on their smartphone.
// This page will send the user's controller's orientation and acceleration
// to be used by the main display.

const Page = () => {
  useStore.setState({ title: 'Controller' })
  const [acc, setAcc] = useState(null)
  const [eul, setEul] = useState(null)

  const currentRoom = useSocketData((s) => s.currentRoom)
  const { setRoom } = useSocketData()
  // const setEulerAngles = useSocketData((s) => s.setEulerAngles)
  // const setAcceleration = useSocketData((s) => s.setAcceleration)
  // const acceleration = useSocketData((s) => s.acceleration)
  const socket = useSocketData((s) => s.socket)
  const roomNumber = useRef(null)

  const [clicked, setClicked] = useState(false)

  function handleOrientation(e) {
    // obtains x y z angles
    const eulerAngles = {
      x: Math.round(e.beta),
      y: Math.round(e.gamma),
      z: Math.round(e.alpha),
    }
    // setEulerAngles(eulerAngles)
    setEul(eulerAngles)
  }
  function handleMotion(e) {
    // setAcceleration({
    //   x: acceleration.x + e.acceleration.x,
    //   y: acceleration.y + e.acceleration.y,
    //   z: acceleration.z + e.acceleration.z,
    // })
    setAcc({
      x: Math.round(e.acceleration.x),
      y: Math.round(e.acceleration.y),
      z: Math.round(e.acceleration.z),
    })
  }

  function attemptToAttachEventListeners() {
    // window.removeEventListener('deviceorientation', handleOrientation)
    // window.removeEventListener('devicemotion', handleMotion, true)

    function requestDeviceOrientation() {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        DeviceOrientationEvent.requestPermission()
          .then((permissionState) => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation)
              window.addEventListener('devicemotion', handleMotion, true)
            }
          })
          .catch(console.error)
      } else {
        // handle regular non iOS 13+ devices
        console.log('not iOS')
        window.addEventListener('deviceorientation', handleOrientation)
        window.addEventListener('devicemotion', handleMotion, true)
      }
    }
    requestDeviceOrientation()
  }

  const [loopStop, loopStart, isActive] = useRafLoop((time) => {
    console.log('sending via socket')
    // send euler angles
    socket.emit('SEND_EULER_ANGLES', {
      room: currentRoom,
      euler_angles: eul,
    })
    // send rate of acceleration
    socket.emit('SEND_ACCELERATION', {
      room: currentRoom,
      acceleration: acc,
    })
  })

  const { x, y, z } = useSocketData((s) => s.eulerAngles)
  // const { x, y, z } = eulerAngles
  const { ax, ay, az } = useSocketData((s) => s.acceleration)
  // const { ax, ay, az } = acceleration

  // console.log(x, y, z)
  // const cursor_xAxisPosition = () => {
  //   // computed using z
  //   let newZ = z
  //   newZ = newZ > 110 ? 110 : newZ
  //   newZ = newZ < 70 ? 70 : newZ
  //   newZ -= 70 // 40 > z > 0
  //   return Math.round((newZ / 40) * 100)
  // }
  // const cursor_yAxisPosition = () => {
  //   // computed using x
  //   let newX = x
  //   newX = newX > 20 ? 20 : newX
  //   newX = newX < -20 ? -20 : newX
  //   newX += 20 // 40 > z > 0
  //   // return 100 - Math.round((newX / 40) * 100)
  //   return Math.round(newX / 40)
  // }
  // const cursor_zAxisPosition = () => {
  //   // computed using y
  //   let newY = y
  //   newY = newY > 20 ? 20 : newY
  //   newY = newY < -20 ? -20 : newY
  //   newY += 20 // 40 > z > 0
  //   // return 100 - Math.round((newY / 40) * 100)
  //   return Math.round(newY / 40)
  // }
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

  return (
    <>
      {/* <Box r3f color={color} rotation={[cx, cz, cy]} />*/}
      <Box
        r3f
        color={color}
        rotation={[x / 50, -(z / 50), -(y / 50)]}
        position={[ax, ay, az]}
      />
      <h2>Pair controller</h2>
      <input
        style={{
          color: '#000',
          minWidth: '10rem',
          minHeight: '3rem',
        }}
        ref={roomNumber}
        type='number'
        name='room'
        id='room'
        defaultValue='1'
        placeholder='Room id'
      />
      <button
        onClick={() => {
          if (clicked) return

          const reg = new RegExp('^\\d+$')
          if (reg.test(roomNumber.current.value)) {
            socket.emit('SWITCH_ROOMS', {
              new_room: String(roomNumber.current.value),
            })
            setRoom(roomNumber.current.value)
            loopStart()
            setClicked(true)
            attemptToAttachEventListeners()
          }
        }}
      >
        Connect to display
      </button>
      <div>
        <p>{JSON.stringify(acc)}</p>
        <p>{JSON.stringify(eul)}</p>
      </div>
    </>
  )
}

export default Page
