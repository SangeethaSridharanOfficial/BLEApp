const validateXYCoords = (x, y) => {
    try{
        let isValid = true;
        if(!x || !y) isValid = false;

        if(isNaN(x) || isNaN(y)) isValid = false

        // if(!(x.toString().length > 1 && x.toString().length < 4) ||
        //     !(y.toString().length > 1 && y.toString().length < 4)) isValid = false;

        return true;
    }catch(err){
        console.error('Error in validateXYCoords ', err.stack);
    }
}

const scanningDevices = (deviceDispatch, devicesAction, manager, delay,) => {
    return new Promise((resolve, reject) => {
        try{
            // stop scanning devices after 5 seconds
            var timer = setTimeout(() => {
                manager.stopDeviceScan();
                clearTimeout(timer);
                return resolve();
            }, delay);

            // scan devices
            manager.startDeviceScan(null, null, (error, scannedDevice) => {
                if (error) {
                    console.warn(error);
                }

                // if a device is detected add the device to the list by dispatching the action into the reducer
                if (scannedDevice) {
                    console.log('Scanned Dev ', scannedDevice.id);
                    scannedDevice['isScanned'] = true;
                    devicesAction(scannedDevice, 'SCANNED_DEVICES')(deviceDispatch);
                }
            });
        }catch(err){
            console.error("Error in scanningDevice ", err);
            return reject();
        }
    })
};

export {
    validateXYCoords,
    scanningDevices
}