const deviceReducer = (state, {type, payload}) => {

    switch(type){
        case 'DEVICES':
            const {id} = payload;
            if(!state.devices.length || (state.devices.length && !state.devices.find(dev => dev.id === id))){
                state.devices.push(payload);
            }else if (state.devices.length && state.devices.find(dev => dev.id === id)){
                state.devices.forEach((device, idx) => {
                    if(device.id === payload.id && device.notLoaded){
                        if(state.devices[idx]['coords']){
                            payload['coords'] = state.devices[idx]['coords'];
                            payload['dType'] = state.devices[idx]['dType'];
                        }
                        state.devices[idx] = payload;
                    }
                })
            }
            return {...state};

        case 'CLEAR':
            state.devices = [];
            return {...state};

        case 'ADD':
            // state.devices = state.devices.filter(dev => dev.id !== payload.id)
            // state.devices.forEach(device => {
            //     if(device.id === payload.id){
                    
            //         delete device;
            //     }
            // });
            
            return {...state};

        case 'SCANNING':
            state.isScanning = payload;
            return state;

        case 'SET_COORDS':
            state.coords = payload.cordinatesVal;
            if(payload.currentDevice){
                state.devices.forEach(device => {
                    if(device.id === payload.currentDevice.id){
                        device['coords'] = payload.cordinatesVal;
                        device['dType'] = payload.dType;
                    }
                });
            }
            return {...state};

        case 'SET_DTYPE':
            state.devices.forEach(device => {
                if(device.id === payload.currentDevice.id){
                    device['dType'] = payload.deviceType;
                }
            });
            return {...state};

        case 'REMOVE_DEVICE':
            state.devices = state.devices.filter(dev => dev.id !== payload.id);
            return {...state};

        case 'ACTIVE_STATE':
            state.activeState = payload;
            return {...state};

        default:
            return state;
    }
};

export default deviceReducer;