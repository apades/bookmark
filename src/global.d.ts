interface Window {
  [k: string]: any
}

interface GlobalThis {
  [k: string]: any
}

declare module '*.js' {
  const content: any
  export default content
}

declare module '*.txt' {
  const content: any
  export default content
}

declare module '*.less' {
  const content: any
  export default content
}
declare module '*.svg' {
  const content: any
  export default content
}
