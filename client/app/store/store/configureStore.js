import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers/index';
import reactImmutableState from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';

export default function configureStore(initialState) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(rootReducer,
    initialState, composeEnhancers(
    applyMiddleware(reactImmutableState(), thunk)
    )
  );
  return store;
}