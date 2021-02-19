import create from 'zustand'
import io from 'socket.io-client'
const socketIo = io('https://ftvzv.sse.codesandbox.io/')

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

  socketIo.on('EULER_ANGLES', (allRooms) => {
    console.log('SETTING_EULER_ANGLES')
    getState().setEulerAngles(allRooms)
  })
  socketIo.on('ACCELERATION', (allRooms) => {
    console.log('SETTING_ACCELERATION')
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

const ping = new Audio('/ping.mp3')

export const [gameStore] = create((set, get) => ({
  count: 0,
  welcome: true,
  api: {
    pong(velocity) {
      ping.currentTime = 0
      ping.volume = clamp(velocity / 20, 0, 1)
      ping.play()
      if (velocity > 4) set((state) => ({ count: state.count + 1 }))
    },
    reset: (welcome) =>
      set((state) => ({ welcome, count: welcome ? state.count : 0 })),
  },
}))

export default useStore
