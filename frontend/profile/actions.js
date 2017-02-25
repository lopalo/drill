

export const SET_FIELD = "profile/SET_FIELD";


export const setField = (fieldName, value) => ({
    type: SET_FIELD,
    fieldName,
    value
});
