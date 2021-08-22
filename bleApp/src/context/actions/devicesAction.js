export default (payload, type) => dispatch => {
    if(type === 'DEVICES' || type === 'ADD' || type === 'REMOVE' 
        || type === 'REMOVE_DEVICE' || type === 'ACTIVE_STATE'){
        dispatch({
            type,
            payload
        })
    }else if(type === 'CLEAR'){
        dispatch({type})
    }else if(type === 'SCANNING' || type === 'SET_COORDS' || type === 'SET_DTYPE'){
        dispatch({type, payload})
    }
    
}