import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';
import produce from 'immer';

interface CellsState {
  data: {
    [key: string]: Cell;
  };
  loading: boolean;
  error: string | null;
  order: string[];
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_CELL: {
      const { id, content } = action.payload;
      state.data[id].content = content;

      return state;
    }
    case ActionType.DELETE_CELL: {
      delete state.data[action.payload];
      state.order = state.order.filter((id) => id !== action.payload);

      return state;
    }
    case ActionType.MOVE_CELL: {
      const { id, direction } = action.payload;
      const index = state.order.findIndex((cellId) => cellId === id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= state.order.length) {
        return state;
      }

      const newOrder = [...state.order];
      [newOrder[index], newOrder[targetIndex]] = [
        newOrder[targetIndex],
        newOrder[index],
      ];

      return {
        ...state,
        order: newOrder,
      };
    }
    case ActionType.INSERT_CELL_BEFORE: {
      const { id, type } = action.payload;
      const newCell: Cell = {
        id: Math.random().toString(36).substr(2, 5),
        type,
        content: '',
      };

      state.data[newCell.id] = newCell;

      const index = state.order.findIndex((cellId) => cellId === id);
      if (index < 0) {
        state.order.push(newCell.id);
      } else {
        state.order.splice(index, 0, newCell.id);
      }

      return state;
    }
    default:
      return state;
  }
}, initialState);

export default reducer;
