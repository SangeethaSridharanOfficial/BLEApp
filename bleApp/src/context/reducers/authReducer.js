const authReducer = (state, {type, payload}) => {

    switch(type){
        case 'LOGIN_SUCCESS':
            let {userName} = payload; 
            return {
                ...state,
                isLoggedIn: true,
                data: { userName }
            };

        case 'LOGOUT':
            return {
                ...state,
                isLoggedIn: false
            }

        case 'FIRST_LOAD':
            return {
                ...state,
                firstLoad: false
            }

        default:
            return state;
    }
};

export default authReducer;