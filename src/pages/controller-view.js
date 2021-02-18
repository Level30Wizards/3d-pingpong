import { useState, useRef } from 'react'
import useStore, { useSocketData } from '@/helpers/store'
import dynamic from 'next/dynamic'

const Sphere = dynamic(() => import('@/components/canvas/Sphere'), {
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
  const setEulerAngles = useSocketData((s) => s.setEulerAngles)
  const setAcceleration = useSocketData((s) => s.setAcceleration)
  const socket = useSocketData((s) => s.socket)
  const roomNumber = useRef(null)

  const [clicked, setClicked] = useState(false)

  function handleOrientation(e) {
    console.log(e)
    // obtains x y z angles
    const eulerAngles = {
      x: Math.round(e.beta),
      y: Math.round(e.gamma),
      z: Math.round(e.alpha),
    }
    setEulerAngles(eulerAngles)
    setEul(eulerAngles)
    // send euler angles for main display (MainDisplayView)
    socket.emit('SEND_EULER_ANGLES', {
      room: currentRoom,
      euler_angles: eulerAngles,
    })
  }
  function handleMotion(e) {
    console.log(e)
    const acceleration = {
      x: Math.round(e.acceleration.x),
      y: Math.round(e.acceleration.y),
      z: Math.round(e.acceleration.z),
    }
    setAcceleration(acceleration)
    setAcc(acceleration)
    // send rate of acceleration for main display (MainDisplayView)
    socket.emit('SEND_ACCELERATION', {
      room: currentRoom,
      acceleration: acceleration,
    })
  }

  function attemptToAttachEventListeners() {
    window.removeEventListener('deviceorientation', handleOrientation)
    window.removeEventListener('devicemotion', handleMotion, true)

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

  return (
    <>
      <Sphere r3f />

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
