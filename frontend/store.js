import {createStore, applyMiddleware} from "redux";

import rootReducer from "./rootReducer";
import configureMiddlewares from "./middlewares";


const configureStore = () => {
    let {middlewares, onStoreCreated} = configureMiddlewares();
    let store = createStore(
        rootReducer,
        applyMiddleware(...middlewares)
    );
    onStoreCreated();
    return store;
};

export default configureStore;
