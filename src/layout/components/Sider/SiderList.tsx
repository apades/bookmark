/**
 * @description layout侧边的带收缩的列表的父组件
 */
import ContainerLoading from '@root/components/ContainerLoading'
import { callFn } from '@root/utils/utils'
import { CSSProperties, useState } from 'react'
import { RoomItem } from './RoomItem'

import './SiderList.less'

type Props<T> = {
  className?: string
  dataList: T[]
  renderHender: (
    handleCollapse: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
  ) => React.ReactElement
  renderFirstItem?: () => React.ReactElement
  renderFooter?: () => React.ReactElement
  // renderItem: (data: T) => React.ReactElement
  renderEmpty?: () => React.ReactElement
  isLoading?: boolean
  loaded?: boolean
  listHeight?: number | string

  collapsed: boolean
  style?: CSSProperties
}
type rProps<T> = Props<T>

function SiderList<T>(props: rProps<T>): React.ReactElement {
  let { isLoading = false, loaded = true, dataList, style = {} } = props

  let listStyle: CSSProperties = {}
  if (props.listHeight) listStyle.height = props.listHeight

  let RenderList = () =>
    isLoading ? (
      <ContainerLoading size="small" />
    ) : loaded ? (
      <ul>
        {props.dataList.map((d, i) => (
          <li key={i} style={{ height: 32 }}>
            {/* {props.renderItem(d)} */}
            <RoomItem data={d} />
          </li>
        ))}
        {props.renderFooter && (
          <li style={{ height: 32 }}>{props.renderFooter()}</li>
        )}
      </ul>
    ) : (
      callFn(props.renderEmpty)
    )

  let [isCollapsed, setCollapsed] = useState(props.collapsed)

  let handleCollapse = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()
    setCollapsed((c) => !c)
  }

  return (
    <div className={`sider-list-area ${props.className}`} style={style}>
      <div className={`sider-list `}>
        {props.renderHender(handleCollapse)}

        {props.renderFirstItem && (
          <div className="first-item">{props.renderFirstItem()}</div>
        )}
        <div
          className="list-container"
          style={{ maxHeight: (props.dataList.length + 5) * 38 }}
        >
          {RenderList()}
        </div>
      </div>
    </div>
  )
}

export default SiderList
