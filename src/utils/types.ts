export type ParamType<T> = T extends (...args: infer P) => any ? P : T

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? A
  : B

type WritableKeys<T> = {
  [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T]

type DeepWritablePrimitive =
  | undefined
  | null
  | boolean
  | string
  | number
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Function
/**返回去除readOnly字段的type */
export type DeepWritable<T> = T extends DeepWritablePrimitive
  ? T
  : T extends Array<infer U>
  ? DeepWritableArray<U>
  : T extends Map<infer K, infer V>
  ? DeepWritableMap<K, V>
  : T extends Set<infer T>
  ? DeepWriableSet<T>
  : DeepWritableObject<T>

type DeepWritableArray<T> = Array<DeepWritable<T>>
type DeepWritableMap<K, V> = Map<K, DeepWritable<V>>
type DeepWriableSet<T> = Set<DeepWritable<T>>

type DeepWritableObject<T> = {
  [K in WritableKeys<T>]: DeepWritable<T[K]>
}

// 测试的，竟然可以用
type testType<T = 'mediaList' | 'test'> =
  | {
      type: T extends 'mediaList' ? T : undefined
      data: { id: string; url: string }[]
      tab: string
    }
  | {
      type: T extends 'test' ? T : undefined
      tab: string
    }

let a: testType<'test'> = {
  type: 'test',
  tab: 'asd',
}

export type dykey = {
  [key: string]: any
}

export type flatDataMapToTypeAndData<T extends dykey, K extends keyof T> = {
  type: K
} & (T[K] extends null
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : {
      data: T[K]
    })

export type PartialOmit<A, B extends keyof A> = Partial<Omit<A, B>>
