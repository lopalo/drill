
import {createSelector as create} from "reselect";

const user = state => state.user;

const isAdmin = create(user, user => user.isAdmin);

export {
    isAdmin
};
