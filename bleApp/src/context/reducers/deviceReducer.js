const deviceReducer = (state, {type, payload}) => {
    switch(type){
        case 'SCANNED_DEVICES':
            if(state.devices.length){
                if(state.devices.find(dev => dev.id === payload.id)){
                    state.devices.forEach((device, idx) => {
                        let tempDevice = payload;
                        if(device.id === payload.id){
                            tempDevice['isSpecialDevice'] = device.isSpecialDevice;
                            if(device.dType){
                                tempDevice['dType'] = device.dType;
                                tempDevice['coords'] = device.coords;
                                state.devices[idx] = tempDevice;
                            }else{
                                state.devices[idx] = payload;
                            }
                        }
                    })
                }else{
                    state.devices.push(payload);
                }
            }else{
                state.devices.push(payload);
            }
            return {...state};

        case 'STORED_DEVICES':
            if(state.devices.length){
                if(state.devices.find(dev => dev.id === payload.id)){
                    state.devices.forEach((device, idx) => {
                        if(device.id === payload.id){
                            let tempDevice = device;
                            tempDevice['dType'] = payload.dType;
                            tempDevice['coords'] = payload.coords;
                            tempDevice['isSpecialDevice'] = payload.isSpecialDevice;
                            state.devices[idx] = tempDevice;
                        }
                    })
                }else{
                    state.devices.push(payload);
                }
            }else{
                state.devices.push(payload);
            }
            return{...state};

        // case 'DEVICES':
        //     const {id} = payload;
        //     if(!state.devices.length || (state.devices.length && !state.devices.find(dev => dev.id === id))){
        //         state.devices.push(payload);
        //         console.log('came no device ', payload)
        //     }else if (state.devices.length && state.devices.find(dev => dev.id === id)){
        //         state.devices.forEach((device, idx) => {
        //             if(device.id === payload.id){
        //                 console.log('came 2nn ', device.id, payload);
        //             }
        //             if(device.id === payload.id && device.notLoaded){
        //                 if(payload.isSpecialDevice){
        //                     device['isSpecialDevice'] = payload['isSpecialDevice']
        //                     if(payload['coords']){
        //                         state.devices[idx]['coords'] = payload['coords'];
        //                         state.devices[idx]['dType'] = payload['dType'];
        //                     }
        //                 }else{
        //                     payload['isSpecialDevice'] = payload['isSpecialDevice'];
        //                     payload['isScanned'] = state.devices[idx]['isScanned'];
        //                     if(state.devices[idx]['coords']){
        //                         payload['coords'] = state.devices[idx]['coords'];
        //                         payload['dType'] = state.devices[idx]['dType'];
        //                     }
        //                     state.devices[idx] = payload;
        //                 }
                        
        //             }else if(device.id === payload.id){
        //                 if(payload.isSpecialDevice){
        //                     console.log('special ', payload.coords, payload.id, payload.isScanned, payload.notLoaded, payload.rssi, payload.dType);
        //                     device['isSpecialDevice'] = payload['isSpecialDevice']
        //                     if(payload['coords']){
        //                         state.devices[idx]['coords'] = payload['coords'];
        //                         state.devices[idx]['dType'] = payload['dType'];
        //                     }
        //                 }else{
        //                     payload['isSpecialDevice'] = payload['isSpecialDevice'];
        //                     state.devices[idx] = payload;
        //                 }
                        
        //             }
        //         })
        //     }
        //     return {...state};

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
                        device['isSpecialDevice'] = payload.addForMobile
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
            return {...state};
    }
};

export default deviceReducer;