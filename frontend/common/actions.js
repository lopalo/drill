
export const SET_PROPERTY = "SET_PROPERTY";
export const CONFIRM_ACTION = "CONFIRM_ACTION";

export const setProperty = (path, value) => ({
    type: SET_PROPERTY,
    path,
    value
});


export const confirmAction = (text, action) => ({
    type: CONFIRM_ACTION,
    text,
    action
});



