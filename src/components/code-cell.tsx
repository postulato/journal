import { useState, useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import bundler from '../bundler';
import { Resizable } from './resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

interface CodeCellProps {
  cell: Cell;
}

export const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = useState<string>('');
  const [err, setErr] = useState<string>('');
  const { updateCell } = useActions();

  useEffect(() => {
    const timerId = setTimeout(async () => {
      const output = await bundler(cell.content);

      setCode(output.code);
      setErr(output.err);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [cell.content]);

  const onChange = (value: string) => {
    updateCell(cell.id, value);
  };

  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction="horizontal">
          <CodeEditor initialValue={cell.content} onChange={onChange} />
        </Resizable>
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};
