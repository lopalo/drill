
export const REQUEST_PROFILE = "profile/REQUEST_PROFILE";
export const SET_PROFILE = "profile/SET_PROFILE";


export const requestProfile = () => ({type: REQUEST_PROFILE});


export const setProfile = (profile) => ({
    type: SET_PROFILE,
    profile
});
