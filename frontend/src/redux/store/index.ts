import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '@redux/reducer';
import mySaga from '@redux/saga';

const sagaMiddleware = createSagaMiddleware();

export default createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(mySaga);
