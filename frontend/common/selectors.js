
import {createSelector as create} from "reselect";

const user = state => state.user;

const isAdmin = create(user, user => user.isAdmin);
const profile = create(user, user => user.profile);

export {
    isAdmin,
    profile
};
