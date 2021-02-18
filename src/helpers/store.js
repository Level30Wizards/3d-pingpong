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
  eulerAngles: null,
  setEulerAngles: (eulerAngles) => {
    set({ eulerAngles })
  },
  acceleration: null,
  setAcceleration: (acceleration) => {
    set({ acceleration })
  },
}))

export default useStore
