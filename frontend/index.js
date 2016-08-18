import "babel-polyfill";
import "whatwg-fetch";

import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";

import Root from "./rootComponent";
import {configureStore} from "./store";


const {store, history} = configureStore();

render(
    <Provider store={store}>
      <Root history={history} />
    </Provider>,
    document.getElementById("app")
);
