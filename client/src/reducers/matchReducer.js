import * as constants from '../constants';

export default function matchReducer(state = {}, action) {
    switch (action.type) {
        case constants.ADD_MATCH:
            return action.payload;
        default: return state;
    }
}
