import { ReactElement } from 'react'
import { render } from 'react-dom'

export let reactRender = (
  App: ReactElement,
  dom: Element = document.getElementById('app')
): void => {
  render(App, dom)
}
