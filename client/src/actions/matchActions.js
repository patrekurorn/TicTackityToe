import * as constants from '../constants';

export const addMatch = match => ({
    type: constants.ADD_MATCH,
    payload: match
});
