import "babel-polyfill";
import "whatwg-fetch";

import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";

import Root from "./rootComponent";
import configureStore from "./store";

const store = configureStore();

render(
    <Provider store={store}>
      <Root />
    </Provider>,
    document.getElementById("app")
);
