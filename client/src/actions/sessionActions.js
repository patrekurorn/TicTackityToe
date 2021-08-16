import * as constants from '../constants';

export const addSession = session => ({
    type: constants.ADD_SESSION,
    payload: session
});

export const removeSession = session => ({
    type: constants.REMOVE_SESSION,
    payload: session
});
