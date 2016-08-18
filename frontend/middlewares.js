/*global DEBUG*/
import createLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import {routerMiddleware} from "react-router-redux";

import authSagas from "./auth/sagas";
import trainingSagas from "./training/sagas";
import myDictionarySagas from "./my-dictionary/sagas";
import dictionarySagas from "./dictionary/sagas";


const configureSagas = sagaMiddleware => {
    let sagas = [
        ...authSagas,
        ...trainingSagas,
        ...myDictionarySagas,
        ...dictionarySagas
    ];
    sagas.forEach(saga => sagaMiddleware.run(saga));
};


export const configureMiddlewares = history => {
    let middlewares = [];
    middlewares.push(thunkMiddleware);
    middlewares.push(routerMiddleware(history));
    let sagaMiddleware = createSagaMiddleware();
    let onStoreCreated = () => configureSagas(sagaMiddleware);
    middlewares.push(sagaMiddleware);
    if (DEBUG) {
        middlewares.push(createLogger({collapsed: true}));
    }
    return {middlewares, onStoreCreated};
};


