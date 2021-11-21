export default (payload, type) => dispatch => {
    if(type === 'SCANNED_DEVICES' || type === 'STORED_DEVICES' || type === 'ADD' || type === 'REMOVE' 
        || type === 'REMOVE_DEVICE' || type === 'ACTIVE_STATE' || type === 'SPECIAL_DEVICE'
        || type === 'DEVICE_HOLDER_COORDS' || type === 'UPDATE_DEVICE_MENU_POPUP'){
        dispatch({
            type,
            payload
        })
    }else if(type === 'CLEAR'){
        dispatch({type})
    }else if(type === 'SCANNING' || type === 'SET_COORDS' || type === 'SET_DTYPE'){
        dispatch({type, payload})
    }else if(type === 'UPDATE_MAP_HOLDER_ELEMENT'){
        dispatch({type, payload})
    }
    
}