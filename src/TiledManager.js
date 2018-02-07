//-----------------------------------------------------------------------------
// TiledManager
//
// The static class that manages TileD data, including extensions.

function TiledManager() {
    throw new Error('This is a static class');
}

window.TiledManager = TiledManager;

let pluginParams = PluginManager.parameters("YED_Tiled");

let _listeners = {}
let _hideFunctions = {}
let _hideIgnoreFunctions = {
    regions: [],
    collisions: [],
    levelChanges: [],
    tileFlags: []
}
let _tileFlags = {}
let _tileFlagIndex = 1;
let _vehicles = {};
let _vehiclesByIndex = [];

let _fullVehicleData = {
    bgm: {
        name: '',
        pan: 0,
        pitch: 100,
        volume: 90
    },
    characterIndex: 0,
    characterName:"",
    startMapId: 0,
    startX: 0,
    startY: 0
};

TiledManager.addListener = function(objectName, event, callback, recursive = true) {
    if(typeof objectName === 'function') {
        objectName = objectName.name
    }
    if(!_listeners[objectName]) {
        _listeners[objectName] = {}
    }
    if(!_listeners[objectName][event]) {
        _listeners[objectName][event] = []
    }
    callback.recursive = !!recursive
    _listeners[objectName][event].push(callback)
}

TiledManager.triggerListener = function(object, event, options = {}) {
    let objectName = object.constructor.name
    if(!_listeners[objectName] || !_listeners[objectName][event]) {
        return false
    }
    let top = true
    let proto = object.__proto__
    while(proto) {
        objectName = proto.constructor.name
        if(_listeners[objectName] && _listeners[objectName][event]) {
            _listeners[objectName][event].forEach(callback => {
                if(top || callback.recursive) {
                    callback.call(object, options)
                }
            })
        }
        top = false
        proto = proto.__proto__
    }
}

TiledManager.addHideFunction = function(id, callback, ignore = []) {
    _hideFunctions[id] = callback

    ignore.forEach((type) => {
        _hideIgnoreFunctions[type].push(id)
    })
}

TiledManager.checkLayerHidden = function(layerData, ignore = []) {
    if(typeof ignore === 'string') {
        ignore = _hideIgnoreFunctions[ignore] || []
    }
    let keys = Object.keys(_hideFunctions);
    let data = false;
    for(let idx = 0; idx < keys.length; idx++) {
        if(ignore.indexOf(keys) !== -1) {
            continue;
        }
        if(layerData.properties && layerData.properties.hasOwnProperty(keys[idx])) {
            data = data || _hideFunctions[keys[idx]](layerData);
        }
        if(data) {
            return data;
        }
    }
    return data;
}

TiledManager.hasHideProperties = function(layerData) {
    return (layerData.properties && (
        Object.keys(_hideFunctions).filter(key => {
            return layerData.properties.hasOwnProperty(key)
        }).length > 0)
    );
}

TiledManager.addFlag = function(...flagIds) {
    flagIds.forEach(flagId => {
        _tileFlags[flagId] = _tileFlagIndex++;
    })
}

TiledManager.getFlag = function(flagId) {
    return _tileFlags[flagId];
}

TiledManager.getFlagNames = function() {
    return Object.keys(_tileFlags);
}

TiledManager.getFlagLocation = function(flagId) {
    let flag = _tileFlags[flagId]
    let bit = (1 << (flag % 16)) & 0xffff;
    let group = Math.floor(flag / 16);
    return [group, bit];
}

TiledManager.getParameterFlags = function() {
    if(!!pluginParams['Custom Tile Flags']) {
        let tileFlags = JSON.parse(pluginParams['Custom Tile Flags']);
        TiledManager.addFlag.apply(this, tileFlags);
    }
}

/* VEHICLES */
TiledManager.createVehicle = function(vehicleName, vehicleData = false) {
    if(!vehicleData) {
        vehicleData = Object.assign({}, _fullVehicleData, {
            bgm: Object.assign({}, _fullVehicleData.bgm)
        });
    } else if(vehicleData !== true) {
        vehicleData = Object.assign({}, _fullVehicleData, vehicleData, {
            bgm: Object.assign({}, _fullVehicleData.bgm, vehicleData.bgm)
        });
    }
    let vehicle = new Game_Vehicle(vehicleName, vehicleData);
    _vehicles[vehicleName] = vehicle;
    _vehiclesByIndex.push(vehicleName);
};

TiledManager.refreshVehicles = function(vehicles = []) {
    _vehiclesByIndex.forEach(vehicleName => {
        if(vehicles.length === 0 || vehicles.indexOf(vehicleName) > -1) {
            _vehicles[vehicleName].refresh();
        }
    });
};

TiledManager.getAllVehicles = function(vehicles = []) {
    let returnVehicles = [];
    _vehiclesByIndex.forEach(vehicleName => {
        if(vehicles.length === 0 || vehicles.indexOf(vehicleName) > -1) {
            returnVehicles.push(_vehicles[vehicleName]);
        }
    });
    return returnVehicles;
};

TiledManager.getVehicle = function(id) {
    if(isNaN(id)) {
        if(_vehicles[id]) {
            return _vehicles[id];
        }
    } else {
        if(id < _vehiclesByIndex.length) {
            return _vehicles[_vehiclesByIndex[id]];
        }
    }
    return null;
}

TiledManager.updateVehicles = function(vehicles = []) {
    _vehiclesByIndex.forEach(vehicleName => {
        if(vehicles.length === 0 || vehicles.indexOf(vehicleName) > -1) {
            _vehicles[vehicleName].update();
        }
    });
}

TiledManager.getParameterVehicles = function() {
    if(!!pluginParams['Custom Vehicles']) {
        let vehicles = JSON.parse(pluginParams['Custom Vehicles']);
        vehicles.forEach(vehicle => {
            let vehicleData = JSON.parse(vehicle);
            TiledManager.createVehicle(vehicleData.vehicleName, vehicleData);
        })
    }
}