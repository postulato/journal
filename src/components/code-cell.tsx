import { useState, useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import bundler from '../bundler';
import { Resizable } from './resizable';

export const CodeCell = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    
    const timerId = setTimeout(async () => {
      const output = await bundler(input);

      setCode(output);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [input]);


  const onChange = (value: string) => {
    setInput(value);
  };

  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="import React from 'react'"
            onChange={onChange}
          />
        </Resizable>
        <Preview code={code} />
      </div>
    </Resizable>
  );
};
