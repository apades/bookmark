import { ChannelJoin } from '@root/actions/channelAction'
import ChannelCreateModal from '@root/components/ChannelCreateModal'
import Iconfont from '@root/components/Iconfont'
import { useT } from '@root/hooks'
import { StateBase } from '@root/reducers'
import { Channel } from '@root/reducers/channel'
import { Team } from '@root/reducers/team'
import { isSpceTeam } from '@root/utils/env'
import { getTextIsOverflow } from '@root/utils/utils'
import { Button, Tooltip } from 'antd'
import { CSSProperties, FC, memo, useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom'
import { RoomItem } from './RoomItem'

import './GroupList.less'
import './SiderList.less'
import InviteModal from '@root/views/teamManage/comp/InviteModal'

type Props = {
  channels: Channel[]
  unjoinChannels?: Channel[]
  team: Team
  name: string
  role: number
  showBrowser: boolean
  color: string
}
type rProps = Props & ConnectedProps<typeof connector>

let collapsedMap = JSON.parse(localStorage['collapsedMap'] ?? '{}')
let toggleCollapsed = (key: string) => {
  let rs = collapsedMap[key]
  if (rs === 'true') {
    delete collapsedMap[key]
  } else {
    collapsedMap[key] = 'true'
  }
  localStorage['collapsedMap'] = JSON.stringify(collapsedMap)
}

type rChannel = Channel & { isOver: boolean }
const GroupList: FC<rProps> = (props) => {
  let [dataList, setdataList] = useState<rChannel[]>([])
  let t = useT()
  let location = useLocation()
  let [isTeamNameOverflow, setTeamNameOverflow] = useState(false)
  let isAdmin = [1, 2].includes(props.role)
  let teamId = props.team.id
  let [isCollUnjoinList, setCollUnjoinList] = useState(true)
  let [isInviteModalShow, setInviteModalShow] = useState(false)
  let team = props.team

  useEffect(() => {
    setdataList(
      props.channels.map((c) => ({
        ...c,
        isOver: getTextIsOverflow(c.name, 138, { fontSize: '14px' }),
      }))
    )
  }, [props.channels])
  useEffect(() => {
    setTeamNameOverflow(
      getTextIsOverflow(props.name, 150, { fontSize: '16px' })
    )
  }, [props.name])
  let history = useHistory()
  let [isCreateModalShow, setCreateModalShow] = useState(false)

  // #########config#########
  const showManageBtn = !isSpceTeam(teamId) || isAdmin,
    showCreateRoomTab = showManageBtn,
    showBrowserTab = props.showBrowser,
    canRenderFooter = showBrowserTab || showCreateRoomTab,
    showInviteTips = team.member_count + team.pending_invite_count < 4
  // #########config#########

  let RenderHeader = () => {
    let handleClick = () => {
      showManageBtn && history.push(`/workspace/manage/${teamId}`)
    }
    return (
      <div
        className={`title f-i-center ${
          new RegExp(`/workspace/(manage|invite)/${teamId}`).test(
            location.pathname
          ) && 'active'
        } ${showManageBtn && 'is-admin'}`}
        onClick={handleClick}
      >
        {/*---- team left icon ----*/}
        {props.team.icon && (
          <img
            crossOrigin="anonymous"
            className="sider-collapse-btn team-icon"
            src={props.team.icon}
          />
        )}
        {!props.team.icon && (
          <div
            className="sider-collapse-btn team-icon"
            style={{ backgroundColor: props.color }}
          >
            {props.name[0].toUpperCase()}
          </div>
        )}
        {/*---- team left icon ----*/}

        <h2>
          <Tooltip
            trigger={isTeamNameOverflow ? 'hover' : ''}
            title={props.name}
            placement="top"
          >
            <span>{props.name}</span>
          </Tooltip>
        </h2>
      </div>
    )
  }

  return (
    <>
      <div className={`sider-list-area sider-group-list`}>
        <div className={`sider-list`}>
          {RenderHeader()}

          {showInviteTips && (
            <>
              <div
                className="invite-tips"
                onClick={() => setInviteModalShow(true)}
              >
                <p>{t('comp.sider_inviteTip')}</p>
                <Button shape="round">
                  <Iconfont type="iconinvite" />
                  {t('public.inviteMembers')}
                </Button>
              </div>
              <InviteModal
                data={props.team}
                onCancel={() => setInviteModalShow(false)}
                visible={isInviteModalShow}
              />
            </>
          )}
          <div className="list-container">
            <ul>
              {dataList.map((d, i) => (
                <li key={i} style={{ height: 32 }}>
                  <RoomItem data={d} />
                </li>
              ))}
              {!!props.unjoinChannels.length && (
                <li
                  className={`unjoin-container ${
                    isCollUnjoinList && 'is-collapse'
                  }`}
                >
                  <div
                    className="group-item"
                    onClick={() => setCollUnjoinList((v) => !v)}
                  >
                    <div className="icon">
                      <span className="room-icon-wrapper">
                        <Iconfont
                          className="normal"
                          type="iconmore"
                          style={{ fontSize: 14 }}
                        />
                      </span>
                    </div>
                    <div className="name">{t('public.unjoined')}</div>
                  </div>
                  <ul
                    className={`unjoin-list`}
                    style={{
                      maxHeight: 32 * props.unjoinChannels.length,
                    }}
                  >
                    {props.unjoinChannels.map((c) => (
                      <li key={c.id}>
                        <NavLink
                          className={`group-item`}
                          to={`/room/${c.id}`}
                          isActive={(match, location) =>
                            new RegExp(`^/room(.*?)/${c.id}`).test(
                              location.pathname
                            )
                          }
                        >
                          <div className="icon">
                            {/* ocuppy */}
                            <span className="room-icon-wrapper">
                              <Iconfont
                                className="normal"
                                type="iconmore"
                                style={{ fontSize: 14, visibility: 'hidden' }}
                              />
                              <Iconfont
                                className="open"
                                type="iconmore"
                                style={{ fontSize: 14, visibility: 'hidden' }}
                              />
                            </span>
                          </div>
                          {/* ocuppy */}
                          <div className="name">{c.name}</div>
                          <Button onClick={() => props.ChannelJoin(c.id)}>
                            {t('public.join')}
                          </Button>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              {canRenderFooter && (
                <li style={{ height: 32 }}>
                  {/* {showBrowserTab && (
                    <NavLink
                      className={`group-item create-group`}
                      to={`/workspace/manage/${teamId}`}
                      isActive={
                        (match, location) => false
                        // new RegExp(`^/room/browser/${teamId}`).test(location.pathname)
                      }
                    >
                      <div className="icon" style={{ marginLeft: 1 }}>
                        <Iconfont size={17} type="icona-viewall" />
                      </div>
                      <div className="name">{t('comp.channelBrowser')}</div>
                    </NavLink>
                  )} */}
                  {showCreateRoomTab && (
                    <div
                      className={`group-item create-group`}
                      onClick={() => setCreateModalShow(true)}
                    >
                      <div className="icon" style={{ marginLeft: 1 }}>
                        <Iconfont className="normal" type="iconicon_add" />
                      </div>
                      <div className="name">{t('public.createRoom')}</div>
                    </div>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <ChannelCreateModal
        tid={teamId}
        onCancel={() => setCreateModalShow(false)}
        visible={isCreateModalShow}
      />
    </>
  )
}

const mapStateToProps = (state: StateBase) => ({})

const mapDispatchToProps = {
  ChannelJoin,
}
let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(memo(GroupList))

// 这里启用就没法去除unread，不用就很卡
// , (pre, next) => {
//   return shallowEqual(pre.channels, next.channels)
// }
