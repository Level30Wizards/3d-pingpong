import { useState, useEffect, useRef } from 'react'
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
  // const [acc, setAcc] = useState(null)
  const [eul, setEul] = useState(null)

  const currentRoom = useSocketData((s) => s.currentRoom)
  const { setRoom } = useSocketData()

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
    setEul(eulerAngles)
  }

  // function handleMotion(e) {
  //   setAcc({
  //     x: Math.round(e.acceleration.x),
  //     y: Math.round(e.acceleration.y),
  //     z: Math.round(e.acceleration.z),
  //   })
  // }

  useEffect(() => {
    if (!clicked || isActive) return

    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation)
            // window.addEventListener('devicemotion', handleMotion, true)
          }
        })
        .catch(console.error)
    } else {
      // handle regular non iOS 13+ devices
      console.log('not iOS')
      window.addEventListener('deviceorientation', handleOrientation)
      // window.addEventListener('devicemotion', handleMotion, true)
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      // window.removeEventListener('devicemotion', handleMotion)
    }
  }, [clicked])

  const [loopStop, loopStart, isActive] = useRafLoop((time) => {
    // send euler angles
    socket.emit('SEND_EULER_ANGLES', {
      room: currentRoom,
      euler_angles: eul,
      // acceleration: acc,
    })
    // // send rate of acceleration
    // socket.emit('SEND_ACCELERATION', {
    //   room: currentRoom,
    //   acceleration: acc,
    // })
  })

  // const { x, y, z } = useSocketData((s) => s.eulerAngles)
  // const { ax, ay, az } = useSocketData((s) => s.acceleration)

  // detect if the user is pointing at the main display
  // const userIsPointingAtScreen = () => {
  //   if (120 >= z && z >= 60 && 30 >= x && x >= -30) {
  //     return true
  //   }
  //   return false
  // }

  // const { color } = useSpring({
  //   color: userIsPointingAtScreen() ? '#272727' : 'black',
  // })

  return (
    <>
      {/* <Box r3f color={color} rotation={[cx, cz, cy]} />*/}
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
            setClicked(true)
            !isActive && loopStart()
          }
        }}
      >
        Connect to display
      </button>
      <div>
        {/* <p>{JSON.stringify(acc)}</p> */}
        <p>{JSON.stringify(eul)}</p>
      </div>
      <button
        onClick={() => {
          socket.emit('NEW_GAME', {
            room: roomNumber.current.value,
          })
        }}
        style={{
          width: '18rem',
          height: '4rem',
          background: 'green',
          color: 'white',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          userSelect: 'none',
        }}
      >
        Click here to start
      </button>
    </>
  )
}

export default Page
