const authReducer = (state, {type, payload}) => {

    switch(type){
        case 'LOGIN_SUCCESS':
            let {email, role} = payload; 
            return {
                ...state,
                isLoggedIn: true,
                data: { userName: email, role }
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