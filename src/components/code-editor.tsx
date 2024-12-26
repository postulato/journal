import MonacoEditor, { type EditorDidMount } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import './code-editor.css';
import Highlighter from 'monaco-jsx-highlighter';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>();

  useEffect(() => {
    const OriginalResizeObserver = window.ResizeObserver;

    window.ResizeObserver = function (callback: ResizeObserverCallback) {
      const wrappedCallback: ResizeObserverCallback = (entries, observer) => {
        window.requestAnimationFrame(() => {
          callback(entries, observer);
        });
      };

      return new OriginalResizeObserver(wrappedCallback);
    } as unknown as { new (callback: ResizeObserverCallback): ResizeObserver };

    for (let staticMethod in OriginalResizeObserver) {
      if (OriginalResizeObserver.hasOwnProperty(staticMethod)) {
        // @ts-ignore
        window.ResizeObserver[staticMethod] =
          // @ts-ignore
          OriginalResizeObserver[staticMethod];
      }
    }
  }, []);

  // @ts-ignore
  const onEditorDidMount: EditorDidMount = (getEditorValue, editor) => {
    editorRef.current = editor;
    // @ts-ignore
    const babelParse = (code) =>
      parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
        allowImportExportEverywhere: true,
        allowReturnOutsideFunction: true,
      });

    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      babelParse,
      traverse,
      editor
    );

    editor.onDidChangeModelContent(() => {
      const editorValue = getEditorValue();
      highlighter.editorValue = editorValue;
      highlighter.highlightCode();

      onChange(editorValue);
    });
  };

  const onFormatClick = () => {
    const unformatted = editorRef.current.getModel().getValue();

    const formatted = prettier
      .format(unformatted, {
        parser: 'babel',
        plugins: [parser],
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, '');

    editorRef.current.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        language="javascript"
        height="100%"
        theme="vs-dark"
        options={{
          wordWrap: 'on',
          tabSize: 2,
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
