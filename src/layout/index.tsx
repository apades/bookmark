import { Layout } from 'antd'
import { throttle } from 'lodash'
import { FC, ReactElement, useEffect, useRef, useState } from 'react'
import CustomDragLayer from './components/CustomDragLayer'
import Header from './components/Header'
import MultiSelectActionBar from './components/MultiSelectActionBar'
import RecoderMenu from './components/RecoderMenu'
import LayoutSide from './components/Sider'
import './index.less'

const { Content } = Layout
type Props = {
  children: ReactElement
}

const LayoutDefalt: FC<Props> = function (props) {
  // isHead: 滚动到顶部
  let [isHead, setHead] = useState(false)
  const scrollRef = useRef<HTMLElement>()
  const handleScroll = throttle(async () => {
    let el = scrollRef.current
    if (!el) return
    let { scrollTop, offsetHeight, scrollHeight } = el
    if (scrollTop === 0) setHead(true)
    else if (~~(scrollTop + offsetHeight) + 3 >= scrollHeight) setHead(false)
    else {
      console.log('LayoutDefalt no head')
      setHead(false)
    }
  }, 100)

  let headerRef = useRef<HTMLElement>()

  // ? 必须放这里，放在上面的前面就会scrollRef.current只触发一次为null
  useEffect(() => {
    console.log('LayoutDefalt start', scrollRef.current)
    if (!scrollRef.current) return
    handleScroll()
    scrollRef.current.addEventListener('scroll', handleScroll, false)
    return () => {
      console.log('LayoutDefalt quit')
      scrollRef.current?.removeEventListener?.('scroll', handleScroll, false)
    }
  }, [scrollRef.current])

  useEffect(() => {
    console.log('LayoutDefalt enter trigger', isHead)
    if (!scrollRef.current || !headerRef.current) return
    if (!isHead) {
      headerRef.current.classList.add('border')
    } else headerRef.current.classList.remove('border')
    return () => headerRef.current.classList.remove('border')
  }, [isHead, scrollRef, headerRef])

  return (
    <div className={`layout-default-main`}>
      <Layout className={`main-container`} style={{ flexDirection: 'row' }}>
        <LayoutSide />
        <Content id="main-layout" className="content">
          {props.children}
          <MultiSelectActionBar />
        </Content>
      </Layout>
      <CustomDragLayer />
    </div>
  )
}

export default LayoutDefalt
