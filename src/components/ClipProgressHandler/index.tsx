import { SliderProps, Range } from 'rc-slider'
import { FC } from 'react'
// import svg_union from '@root/assets/Union.svg'
import svg_hNomarl from '@root/assets/滑杆.svg'
import svg_hActive from '@root/assets/滑杆-选中及悬停.svg'
import './index.less'

let ClipProgressHandler: SliderProps['handle'] = (
  props
): React.ReactElement => {
  return (
    <div
      key={props.index}
      className={`clip-progress-handler ${
        props.className.includes('dragging') && 'dragging'
      }`}
      style={{ left: props.offset + '%' }}
    >
      <img src={svg_hNomarl} className="normal" />
      <img src={svg_hActive} className="active" />
    </div>
  )
}

export default ClipProgressHandler
