/*global DEBUG*/
import createLogger from "redux-logger";
import createSagaMiddleware from "redux-saga";

import profileSagas from "./auth/sagas";
import trainingSagas from "./training/sagas";
import myDictionarySagas from "./my-dictionary/sagas";


const configureSagas = sagaMiddleware => {
    let sagas = [
        ...profileSagas,
        ...trainingSagas,
        ...myDictionarySagas
    ];
    sagas.forEach(saga => sagaMiddleware.run(saga));
};


const configureMiddlewares = () => {
    let middlewares = [];
    let sagaMiddleware = createSagaMiddleware();
    let onStoreCreated = () => configureSagas(sagaMiddleware);
    middlewares.push(sagaMiddleware);
    if (DEBUG) {
        middlewares.push(createLogger({collapsed: true}));
    }
    return {middlewares, onStoreCreated};
};

export default configureMiddlewares;

