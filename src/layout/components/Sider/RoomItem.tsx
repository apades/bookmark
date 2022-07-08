import { useDrop } from 'react-dnd'
import { Tooltip } from 'antd'
import { NavLink } from 'react-router-dom'
import Iconfont from '@root/components/Iconfont'
import classNames from 'classnames'
import { channelVideoAdd } from '@root/actions/channelAction'

import { useDispatch } from 'react-redux'
import type { Channel as Room } from '@root/reducers/channel'
import type { Video } from '@root/types/items'

import './roomItem.less'

type ExtendRoom = Room & { isOver: boolean }
type Props = {
  data: ExtendRoom | any
}

export function RoomItem(props: Props) {
  const data = props.data as ExtendRoom
  const icon = data.is_private ? 'iconroom_pri' : 'iconroom_pub'

  const dispatch = useDispatch()

  const handleDrop = (videos: Video[]) => {
    videos.forEach((video) => {
      dispatch(channelVideoAdd(data.id, video, 'move'))
    })
  }

  const [{ hovered }, drop] = useDrop<
    { type: string; data: Video[] },
    void,
    { hovered: boolean }
  >({
    accept: 'item',
    drop: (e) => {
      console.log('drop', e)
      handleDrop(e.data)
    },
    canDrop: () => true,
    collect: (monitor) => ({
      hovered: monitor.isOver(),
    }),
  })

  return (
    <Tooltip
      trigger={data.isOver ? 'hover' : ''}
      title={data.name}
      placement="right"
    >
      <NavLink
        ref={drop}
        className={
          classNames('group-item', {
            unmember: !data.is_member,
            hovered: hovered,
          })
          // `group-item ${!data.is_member && 'unmember'}`
        }
        to={`/room/${data.id}`}
        isActive={(match, location) =>
          new RegExp(`^/room(.*?)/${data.id}`).test(location.pathname)
        }
      >
        <div className="icon">
          <span className="room-icon-wrapper">
            <Iconfont className="normal" type={icon} style={{ fontSize: 14 }} />
            <Iconfont
              className="open"
              type={icon}
              style={{ color: '#fff', fontSize: 14 }}
            />
          </span>
        </div>
        <div className="name">{data.name}</div>
        {!!data.unread && <div className="new-count">{data.unread}</div>}
      </NavLink>
    </Tooltip>
  )
}
