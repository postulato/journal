import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { persistMiddleware } from './middlewares/persist-middleware';

// const customMiddleware = (smth: any) => {
//     return (next: any) => {

//         return (action: any) => {
//             next(action);
//             console.log('SMTH', smth);
//             console.log('NEXT', next);
//             console.log('ACTION', action);
//         };
//     };
// }



export const store = createStore(reducers, {}, applyMiddleware( persistMiddleware, thunk ));
