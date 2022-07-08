import { FC, ReactNode } from 'react'
import './index.less'

type Props = {
  children: ReactNode
  className?: string
  modalClassName?: string
}

let Modal: FC<Props> = (props) => {
  return (
    <div className={`modal-layer ${props.modalClassName ?? ''}`}>
      <div className={`modal-content ${props.className ?? ''}`}>
        {props.children}
      </div>
    </div>
  )
}

export default Modal
