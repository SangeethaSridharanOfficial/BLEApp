export default (type, payload) => dispatch => {
    if(type === 'LOGOUT' || type === 'FIRST_LOAD'){
        dispatch({
            type
        })
    }else if(type === 'LOGIN_SUCCESS'){
        dispatch({
            type,
            payload
        })
    }
}