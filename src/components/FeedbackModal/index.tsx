import { copyText } from '@root/utils'
import { Button, message, Modal, ModalProps } from 'antd'
import { FC, HtmlHTMLAttributes, useRef } from 'react'
import './index.less'

type Props = ModalProps
let FeedbackModal: FC<Props> = (props) => {
  let emailLinkRef = useRef<HTMLAnchorElement>()
  return (
    <Modal
      // modalClassName="feeback-layer"
      className="feedback-modal"
      centered
      {...props}
    >
      <p style={{ marginBottom: 13 }}>
        Feel free to send us any bugs or suggestions. Thank you very much for
        your support.
      </p>
      <p style={{ marginBottom: 24 }}>
        Contact us: <span>joel@vidline.com</span>
      </p>
      <a ref={emailLinkRef} href="mailto:joel@vidline.com"></a>
      <Button
        type="primary"
        className="copy-btn"
        onClick={() => {
          emailLinkRef.current.click()
          // props.onCancel()
        }}
      >
        Mail to
      </Button>
    </Modal>
  )
}
export default FeedbackModal
