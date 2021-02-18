import create from 'zustand'
import io from 'socket.io-client'
const socketIo = io('/')

const useStore = create((set) => {
  return {
    router: {},
    events: null,
    setEvents: (events) => {
      set({ events })
    },
  }
})

export const initSocket = () => {
  // const { pathname } = window.location
  const { getState } = useSocketData

  socketIo.on('SWITCH_ROOMS', ({ room }) => {
    console.log('switching rooms in store')

    getState().setRoom(room)
  })

  socketIo.on('SEND_EULER_ANGLES', (allRooms) => {
    getState().setEulerAngles(allRooms)
  })
  socketIo.on('SEND_ACCELERATION', (allRooms) => {
    getState().setAcceleration(allRooms)
  })
  socketIo.on('disconnect', () => {
    getState().setRoom(null)
  })
}

export const useSocketData = create((set) => ({
  socket: socketIo,
  currentRoom: null,
  setRoom: (id) => {
    set({ currentRoom: id })
  },
  eulerAngles: { x: null, y: null, z: null },
  // x: null, // -180 to 180
  // y: null, // -90 to 90
  // z: null // 0 to 360
  setEulerAngles: (eulerAngles) => {
    set({ eulerAngles })
  },
  acceleration: { x: 0, y: 0, z: 0 },
  // in meters per second squared
  setAcceleration: (acceleration) => {
    set({ acceleration })
  },
}))

export default useStore
