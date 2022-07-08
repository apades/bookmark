/**
 * @description my_videos多选时底部的组件
 */
import { loadFolders, removeItems } from '@root/actions/folderAction'
import { restoreItems } from '@root/actions/trashAction'
import I18nHtmlComp from '@root/components/I18nHtmlComp'
import Iconfont from '@root/components/Iconfont'
import MoveFolderModal from '@root/components/MoveFolderModal'
import { useDp, useT } from '@root/hooks'
import { getT } from '@root/i18n'
import { StateBase } from '@root/reducers'
import { SelectItem } from '@root/reducers/select'
import { ErrorCode } from '@root/types/field'
import { Button, Modal } from 'antd'
import cx from 'classnames'
import { FC, memo, useState } from 'react'
// import { deleteSearchItem } from '../actions/searchAction'
import { connect, ConnectedProps } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
// import { moveToTrash } from '../actions/folderAction'
// import { restoreItems, deleteItems } from '../actions/trashAction'
import './MultiSelectActionBar.less'

type Props = {
  className?: string
}
type rProps = ConnectedProps<typeof connector> & Props

const MultiSelectActionBar: FC<rProps> = function (props) {
  const [isShowMoveFolder, setIsShowMoveFolder] = useState(false)

  const {
    selectedItems,
    // selectedTrashItems,
  } = props
  let dispatch = useDp()
  let t = useT()

  const cls = cx('multi-select-action-bar f-i-center' + ' ' + props.className, {
    active:
      /* selectedItems.length + selectedTrashItems.length */ selectedItems.length,
  })

  let route = useRouteMatch()
  let isTrashPage = /^\/trash/.test(route.path)

  let RenderActionArea = () => {
    const handleDelete = () => {
      Modal.confirm({
        className: 'cus-modal reverse-btn',
        title: t('comp.deleteMutiTitle'),
        content: t('comp.deleteDesc'),
        onOk() {
          console.log('item', selectedItems)
          return props.removeItems(selectedItems, 'trash')
        },
        icon: <Iconfont type="iconicon_warning" />,
        okText: t('public.delete'),
        cancelText: t('public.cancel'),
      })
    }
    const handleRestore = () => {
      // restoreItems(selectedTrashItems)
      console.log('restoreItems(selectedTrashItems)')
      props
        .restoreItems(selectedItems)
        .then(() => props.loadFolders(true))
        .catch((err) => {
          if (err.data.code === ErrorCode.freeVideoLenLimit) {
            // setRecoverLimitModalShow(true)
            // ? 多选时添加
          }
        })
    }
    const handleDeleteForever = () => {
      Modal.confirm({
        title: <I18nHtmlComp i18nKey="pages.trash.deleteMutiForeverConfirm" />,
        className: 'cus-modal reverse-btn',
        onOk() {
          console.log('item', selectedItems)
          return props.removeItems(selectedItems, 'delete')
        },
        icon: <Iconfont type="iconicon_warning" />,
        okText: t('public.delete'),
        cancelText: t('public.cancel'),
      })
    }

    return (
      <div className="action">
        {
          // 普通页面功能
          selectedItems.length > 0 && !isTrashPage ? (
            <>
              <Button
                onClick={() => {
                  setIsShowMoveFolder(true)
                }}
                type="primary"
              >
                <Iconfont type="iconicon_moveto_blue1" />
                {t('public.move')}
              </Button>
              <Button className="del" onClick={handleDelete} danger>
                <Iconfont type="icontrash" size={16} />
                {/* {t('public.delete')} */}
                {t('public.remove')}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleRestore} type="primary">
                <Iconfont type="iconforward" />
                {t('public.restore')}
              </Button>
              <Button className="del" onClick={handleDeleteForever} danger>
                <Iconfont type="iconicon_trash_grey1" />
                {t('public.delete')}
              </Button>
            </>
          )
        }
      </div>
    )
  }

  return (
    <>
      <div className={cls}>
        <div className="container f-i-center">
          <span className="selected-num">
            {t('public.selected')}{' '}
            <span className="number">
              {
                /* {selectedItems.length + selectedTrashItems.length} */ selectedItems.length
              }
            </span>
          </span>
          {RenderActionArea()}
        </div>
        <div
          className="close-btn"
          onClick={() => dispatch({ type: 'select/clear' })}
        >
          <Iconfont className="f-center" type="iconclose" />
        </div>
      </div>

      <MoveFolderModal
        visible={isShowMoveFolder}
        onCancel={() => {
          setIsShowMoveFolder(false)
        }}
        items={selectedItems}
      />
    </>
  )
}

type StateProps = {
  selectedItems: SelectItem[]
}
const mapStateToProps = (state: StateBase): StateProps => {
  return {
    selectedItems: state.select.selectItems,
    // selectedTrashItems: state.multipleSelect.selectedTrashItems,
  }
}

const mapDispatchToProps = {
  removeItems,
  restoreItems,
  loadFolders,
}

let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(memo(MultiSelectActionBar))
