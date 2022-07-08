/**
 * @description my_videos拖拽文件/视频用的组件
 */
import { useT } from '@root/hooks'
import { getClientRects } from '@root/utils/utils'
import cx from 'classnames'
import { CSSProperties, FC } from 'react'
import { useDragLayer, useDrop, XYCoord } from 'react-dnd'
import './index.less'

const layerStyles: CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 912,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

function getItemStyles(
  initialOffset: XYCoord,
  currentOffset: XYCoord,
  initialClientOffset: XYCoord,
  lockY?: boolean
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }
  let { x, y } = currentOffset
  const _x = x + (initialClientOffset.x - initialOffset.x)
  const _y = lockY
    ? initialOffset.y
    : y + (initialClientOffset.y - initialOffset.y)
  const transform = `translate(${_x}px, ${_y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}
let siderHeight = getClientRects(document.querySelector('aside'))?.height
let getSiderHeight = () => {
  if (!siderHeight)
    siderHeight = getClientRects(document.querySelector('aside'))?.height
  return siderHeight
}
const CustomDragLayer: FC<any> = function (props) {
  const {
    itemType,
    isDragging,
    item,
    initialClientOffset,
    initialOffset,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialClientOffset: monitor.getInitialClientOffset(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))
  let t = useT()

  if (itemType === 'aside-resize') {
    return (
      <div className="custom-drag-sider-layer" style={layerStyles}>
        <div
          className="custom-drag-sider"
          style={{
            ...getItemStyles(
              initialOffset,
              currentOffset,
              initialClientOffset,
              true
            ),
            height: getSiderHeight(),
          }}
        ></div>
      </div>
    )
  }

  if (!isDragging || !item.data) {
    return null
  }

  const selectedFolders = item.data.filter(
    (item: any) => item.itemType === 'folder'
  )
  const selectedVideos = item.data.filter(
    (item: any) => item.itemType === 'video'
  )

  // console.log(item.data)
  let data = item.data[0]

  let isSingleVideo = item.data.length === 1 && data.itemType === 'video'

  const blockCls = cx('custom-drag-layer-block', {
    multiple: item.data.length > 1,
    'is-single-video': isSingleVideo,
  })

  console.log('item.data[0]', item.data[0])
  function renderSingleItem() {
    if (data.itemType === 'video') {
      // let rect = getClientRects(document.querySelector('.thumbnail-area'))
      return (
        <div
          className={`layer-item-video`}
          style={{
            width: data.width,
            height: data.height,
            // transform: `translate(-${data.offsetX}px,-${data.offsetY}px)`,
          }}
        >
          <img crossOrigin="anonymous" src={data.cover} />
        </div>
      )
    } else
      return (
        <div className={`layer-item ${data.itemType}`}>
          <span className="title">{data.name}</span>
        </div>
      )
  }
  return (
    <div className="custom-drag-layer" style={layerStyles}>
      <div
        className={blockCls}
        style={getItemStyles(
          initialOffset,
          isSingleVideo
            ? {
                x: currentOffset?.x - data.offsetX,
                y: currentOffset?.y - data.offsetY,
              }
            : currentOffset,
          initialClientOffset
        )}
      >
        {item.data.length > 1 ? (
          <>
            {selectedFolders.length > 0 && (
              <div className="layer-item folder">
                {t('public.folder')}
                <div className="count">{selectedFolders.length}</div>
              </div>
            )}
            {selectedVideos.length > 0 && (
              <div className="layer-item video">
                {t('public.video')}
                <div className="count">{selectedVideos.length}</div>
              </div>
            )}
          </>
        ) : (
          renderSingleItem()
        )}
      </div>
    </div>
  )
}

export default CustomDragLayer
