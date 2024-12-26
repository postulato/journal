import React from 'react';
import { type Cell } from '../state';
import { CodeCell } from './code-cell';
import TextEditor from './text-editor';

interface CellListItemProps {
  cell: Cell;
}

export const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  let child: JSX.Element = cell.type === 'code' ? <CodeCell cell={cell} /> : <TextEditor cell={cell} />;

  return <div>{child}</div>;
};
