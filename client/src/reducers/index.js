import { combineReducers } from "redux";
import socket from "./socketReducer";
import session from "./sessionReducer";
import match from "./matchReducer";

export default combineReducers({
    socket,
    session,
    match,
})
