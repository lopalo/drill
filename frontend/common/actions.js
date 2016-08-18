
export const SET_PROPERTY = "SET_PROPERTY";

export const setProperty = (path, value) => ({
    type: SET_PROPERTY,
    path,
    value
});


export const empty = () => ({type: null});


