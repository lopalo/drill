/*global DEBUG*/
import createLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import createSagaMiddleware from "redux-saga";

import authSagas from "./auth/sagas";
import trainingSagas from "./training/sagas";
import myDictionarySagas from "./my-dictionary/sagas";


const configureSagas = sagaMiddleware => {
    let sagas = [
        ...authSagas,
        ...trainingSagas,
        ...myDictionarySagas
    ];
    sagas.forEach(saga => sagaMiddleware.run(saga));
};


export const configureMiddlewares = () => {
    let middlewares = [];
    middlewares.push(thunkMiddleware);
    let sagaMiddleware = createSagaMiddleware();
    let onStoreCreated = () => configureSagas(sagaMiddleware);
    middlewares.push(sagaMiddleware);
    if (DEBUG) {
        middlewares.push(createLogger({collapsed: true}));
    }
    return {middlewares, onStoreCreated};
};


