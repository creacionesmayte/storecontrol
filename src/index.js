import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import { Provider } from "react-redux";
import rootReducer from "./Redux/rootReducer";
import thunk from "redux-thunk";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
    faPaperPlane,
    faGaugeSimple,
    faCartShopping,
    faClipboardList,
    faFlask,
    faBars,
    faClose,
    faSearch,
    faPlus,
    faMinus,
    faAngleLeft,
    faAngleRight,
    faRightLeft,
    faPrint,
    faEdit,
    faTrash,
    faAngleUp,
    faAngleDown,
    faCreditCard,
    faMoneyBill1Wave,
    faCirclePlus,
    faCircleMinus,
    faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

library.add(
    fab,
    faPaperPlane,
    faGaugeSimple,
    faCartShopping,
    faClipboardList,
    faFlask,
    faBars,
    faClose,
    faSearch,
    faPlus,
    faMinus,
    faAngleLeft,
    faAngleRight,
    faRightLeft,
    faPrint,
    faEdit,
    faTrash,
    faAngleUp,
    faAngleDown,
    faCreditCard,
    faMoneyBill1Wave,
    faCirclePlus,
    faCircleMinus,
    faArrowRightFromBracket
);

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        {window.desktop ? (
            <HashRouter>
                <Provider store={store}>
                    <App />
                </Provider>
            </HashRouter>
        ) : (
            <BrowserRouter>
                <Provider store={store}>
                    <App />
                </Provider>
            </BrowserRouter>
        )}
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
