import create from 'zustand'
import io from 'socket.io-client'
import clamp from 'lodash-es/clamp'

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
  const { getGameState = getState } = gameStore

  socketIo.on('ROOM', (room) => {
    getState().setRoom(room)
  })

  socketIo.on('SWITCH_ROOMS', (room) => {
    getState().setRoom(room)
  })

  socketIo.on('NEW_GAME', () => {
    getGameState().welcome && getGameState().api.reset(false)
  })

  socketIo.on('EULER_ANGLES', (eulerAngles) => {
    getState().setEulerAngles(eulerAngles)
  })
  socketIo.on('ACCELERATION', (acceleration) => {
    getState().setAcceleration(acceleration)
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

export const [gameStore] = create((set, get) => ({
  count: 0,
  welcome: true,
  ping: null,
  setPing: (newPing) => set({ ping: newPing }),
  api: {
    pong(velocity) {
      get().ping.currentTime = 0
      get().ping.volume = clamp(velocity / 20, 0, 1)
      get().ping.play()
      if (velocity > 4) set((state) => ({ count: state.count + 1 }))
    },
    reset: (welcome) =>
      set((state) => ({ welcome, count: welcome ? state.count : 0 })),
  },
}))

export default useStore
