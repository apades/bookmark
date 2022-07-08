export type SelectItem<T = 'video' | 'folder'> = {
  itemType: T
  id: string
  name: string
  pid: string
}

export type SelectState = {
  selectItems: SelectItem[]
}
let selectState: SelectState = {
  selectItems: [],
}

export type SelectAction = SelectAdd | SelectCrear | SelectRemove
type SelectAdd = {
  type: 'select/add'
  data: SelectItem
}
type SelectCrear = {
  type: 'select/clear'
}
type SelectRemove = {
  type: 'select/remove'
  id: string
}

export default function select(
  state = selectState,
  action: SelectAction
): SelectState {
  switch (action.type) {
    case 'select/add': {
      console.log('select/add', action.data)
      return {
        ...state,
        selectItems: [...state.selectItems, action.data],
      }
    }
    case 'select/clear': {
      return {
        ...state,
        selectItems: [],
      }
    }
    case 'select/remove': {
      return {
        ...state,
        selectItems: state.selectItems.filter((d) => d.id !== action.id),
      }
    }
    default:
      return state
  }
}
