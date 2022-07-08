import { LoadingOutlined } from '@ant-design/icons'
import { useDp, useMobile, useOnce } from '@root/hooks'
import { StateBase } from '@root/reducers'
import { minmax } from '@root/utils'
import { Layout } from 'antd'
import React, {
  CSSProperties,
  FC,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useDrag } from 'react-dnd'
import { connect, ConnectedProps } from 'react-redux'
import './FolderList.less'
import './FolderListItem.less'
import './index.less'

let { Sider } = Layout

type rProps = ConnectedProps<typeof connector>

let dragStartWidth = 0,
  dragStartX = 0
const LayoutSide: FC<rProps> = (props) => {
  // console.log('LayoutSide update')

  const isMoble = useMobile()

  let dispatch = useDp()
  let [isSiderLoading, setSiderLoading] = useState(true)

  // - 顶和底是否同时进入视窗判断overflow
  let listStartRef = useRef<HTMLDivElement>(),
    listEndRef = useRef<HTMLDivElement>()
  let [isStartVis, setStartVis] = useState(true)
  let [isEndVis, setEndVis] = useState(true)
  useOnce(() => {
    let observer = new IntersectionObserver((entries, observer) => {
      let isInter = entries[0].isIntersecting,
        cls = entries[0].target.className
      if (cls === 'end') {
        setEndVis(isInter)
      } else setStartVis(isInter)
      console.log('detect overflow cls', entries[0].target.className, isInter)
    })
    // ! 一个奇怪的bug，如果先ob start，end就不会触发inter检测，导致如果一开始就overf就没法检测
    setTimeout(() => {
      observer.observe(listEndRef.current)
      observer.observe(listStartRef.current)
    }, 0)

    return () => {
      console.log('disconnect')
      observer.disconnect()
    }
  })

  let [width, setWidth] = useState(+localStorage['sider-width'] || 245)
  // let initMaxWidth = 245
  useEffect(() => {
    ;(document.body as any)?.attributeStyleMap?.set?.(
      '--sider-width',
      width + 'px'
    )
  }, [width])

  let minWidth = 220
  let style: CSSProperties = {
    minWidth,
    maxWidth: width,
    width: width,
    height: '100%',
    position: 'relative',
    left: 0,
  }
  if (isMoble) {
    let mStyle: CSSProperties = {
      maxWidth: props.showMobileMenu ? '100vw' : 0,
      position: 'fixed',
      left: props.showMobileMenu ? 0 : `-${width}px`,
    }
    Object.assign(style, mStyle)
  }

  const handleCloseMenu = (e: React.SyntheticEvent<HTMLDivElement>) => {
    if (!props.showMobileMenu) return
    console.log('handleCloseMenu: e -> ', e)
    let target = e.target as HTMLElement
    while (target !== null) {
      let collapse =
        target.nodeName === 'A' &&
        target.getAttribute('data-sidebar-collapse') !== 'false'

      collapse =
        collapse || target.getAttribute('data-sidebar-collapse') === 'true'

      if (collapse) {
        dispatch({
          type: 'setting/set',
          showMobileMenu: false,
        })
        break
      }

      if (target.parentElement && target.parentElement.nodeName !== 'Body') {
        target = target.parentElement
      } else {
        target = null
      }
    }
  }

  let [, resizeRef] = useDrag({
    item: { type: 'aside-resize' },
  })

  return (
    <aside style={style} className="side-bar">
      <div
        style={{ width: isMoble ? 245 : width }}
        className={`side-bar-container`}
        onClick={handleCloseMenu}
      >
        <div
          className={`list-area ${!(isEndVis && isStartVis) && 'is-overflow'}`}
        >
          <div className="start" ref={listStartRef}></div>

          {isSiderLoading && (
            <div style={{ width: '100%', height: 300 }} className="f-center">
              <LoadingOutlined />
              <p style={{ marginTop: 10 }}>Loading</p>
            </div>
          )}
          {/* {!isSiderLoading &&
            props.boo.map((team, i) => {
              let groupList = props.channels.filter(
                (c) => c.team_id === team.id
              )
              let showBrowser = groupList.length >= 6

              let list = groupList.filter((c) => c.is_member)
              let unJoinList = groupList.filter((c) => !c.is_member)
              return (
                <GroupList
                  key={team.id}
                  channels={list}
                  team={team}
                  name={team.name}
                  role={team.role}
                  showBrowser={false}
                  unjoinChannels={unJoinList}
                  color={_env.siderColors[i % _env.siderColors.length]}
                />
              )
            })} */}

          <div className="end" ref={listEndRef}></div>
        </div>
      </div>
      {isMoble && props.showMobileMenu && (
        <div
          className="mask"
          onClick={() => {
            dispatch({
              type: 'setting/set',
              showMobileMenu: false,
            })
          }}
        ></div>
      )}
      <div
        className="resize-trigger-area"
        ref={resizeRef}
        onDragStart={(e) => {
          dragStartX = e.pageX
          console.log('start', e.pageX)
          dragStartWidth = width
        }}
        onDragEnd={(e) => {
          let swidth = dragStartWidth + e.pageX - dragStartX
          swidth = minmax(swidth, 220)
          localStorage['sider-width'] = swidth
          setWidth(swidth)
        }}
      ></div>
    </aside>
  )
}

const mapStateToProps = (state: StateBase) => ({
  ...state.setting,
  ...state.bookmarks,
})

const mapDispatchToProps = {}

let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(memo(LayoutSide))
