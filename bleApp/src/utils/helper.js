const validateXYCoords = (x, y) => {
    try{
        let isValid = true;
        if(!x || !y) isValid = false;

        if(isNaN(x) || isNaN(y)) isValid = false

        if(!(x.toString().length > 1 && x.toString().length < 4) ||
            !(y.toString().length > 1 && y.toString().length < 4)) isValid = false;

        return isValid;
    }catch(err){
        console.error('Error in validateXYCoords ', err.stack);
    }
}

const scanningDevices = (deviceDispatch, devicesAction, manager) =>{

    // scan devices
    manager.startDeviceScan(null, null, (error, scannedDevice) => {
        if (error) {
            console.warn(error);
        }

        // if a device is detected add the device to the list by dispatching the action into the reducer
        if (scannedDevice) {
            console.log('Scanned Dev ', scannedDevice.id);
            scannedDevice['isScanned'] = true;
            devicesAction(scannedDevice, 'DEVICES')(deviceDispatch);
        }
    });

    // stop scanning devices after 5 seconds
    setTimeout(() => {
        manager.stopDeviceScan();
    }, 5000);
};

export {
    validateXYCoords,
    scanningDevices
}