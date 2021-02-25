import { useRouter } from 'next/router'
import useStore from '@/helpers/store'
import React, { useEffect, Children } from 'react'
import Header from '../config'
import dynamic from 'next/dynamic'
import Dom from '@/components/layout/_dom'
import '@/styles/index.css'

let LCanvas = null
if (process.env.NODE_ENV === 'production') {
  LCanvas = dynamic(() => import('@/components/layout/_canvas'), {
    ssr: false,
  })
} else {
  LCanvas = require('@/components/layout/_canvas').default
}

function SplitApp({ canvas, dom }) {
  return (
    <>
      <Header />
      {dom && <Dom dom={dom} />}
      <LCanvas>{canvas && <group>{canvas}</group>}</LCanvas>
    </>
  )
}

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  let r3fArr = []
  let compArr = []
  Children.forEach(Component().props.children, (child) => {
    if (child.props && child.props.r3f) {
      r3fArr.push(child)
    } else {
      compArr.push(child)
    }
  })

  /**
   * why-did-you-render README
   * https://github.com/welldone-software/why-did-you-render
   */
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      const whyDidYouRender = require('@welldone-software/why-did-you-render')
      whyDidYouRender(React, {
        trackAllPureComponents: true,
      })
    }
  }

  /**
   * To debug a component:
   *
   * const Whatever = () => <Box />
   *
   * Whatever.whyDidYouRender = true
   *
   * export { Whatever }
   */

  useEffect(() => {
    useStore.setState({ router })
  }, [router])

  return r3fArr.length > 0 ? (
    <SplitApp canvas={r3fArr} dom={compArr} />
  ) : (
    <Component {...pageProps} />
  )
}

export default MyApp
