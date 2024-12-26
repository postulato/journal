import { CodeCell } from './components/code-cell';
import TextEditor from './components/text-editor';
import { Provider } from 'react-redux';
import { store } from './state';
import { CellList } from './components/cell-list';

export const App = () => {
  return (
    <Provider store={store}>
      <div>
        <CellList />
        {/* <TextEditor /> */}
        {/* <CodeCell/> */}
      </div>
    </Provider>
  );
};
