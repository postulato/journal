import { ActionType } from '../action-types';
import { Action } from '../actions';
import { CellDirection, CellType } from '../cell';

export const updateCell = (id: string, content: string): Action => ({
  type: ActionType.UPDATE_CELL,
  payload: {
    content,
    id,
  },
});

export const deleteCell = (id: string): Action => ({
  type: ActionType.DELETE_CELL,
  payload: id,
});

export const moveCell = (id: string, direction: CellDirection): Action => ({
  type: ActionType.MOVE_CELL,
  payload: {
    direction,
    id,
  },
});

export const insertCellBefore = (id: string, type: CellType): Action => ({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: { id, type },
});
