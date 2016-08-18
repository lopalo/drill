import {createHashHistory} from "history";
import {useRouterHistory} from "react-router";
import {createStore, applyMiddleware} from "redux";
import {syncHistoryWithStore} from "react-router-redux";

import rootReducer from "./rootReducer";
import {configureMiddlewares} from "./middlewares";


export const configureStore = () => {
    let history = useRouterHistory(createHashHistory)({queryKey: false});
    let {middlewares, onStoreCreated} = configureMiddlewares(history);
    let store = createStore(
        rootReducer,
        applyMiddleware(...middlewares)
    );
    history = syncHistoryWithStore(history, store);
    onStoreCreated();
    return {store, history};
};

