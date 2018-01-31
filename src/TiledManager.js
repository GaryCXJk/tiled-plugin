//-----------------------------------------------------------------------------
// TiledManager
//
// The static class that manages TileD data, including extensions.

function TiledManager() {
    throw new Error('This is a static class');
}

window.TiledManager = TiledManager;

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

TiledManager.addListener = function(objectName, listener, callback, recursive = true) {
    if(typeof objectName === 'function') {
        objectName = objectName.name
    }
    if(!_listeners[objectName]) {
        _listeners[objectName] = {}
    }
    if(!_listeners[objectName][listener]) {
        _listeners[objectName][listener] = []
    }
    callback.recursive = !!recursive
    _listeners[objectName][listener].push(callback)
}

TiledManager.triggerListener = function(object, listener, options = {}) {
    let objectName = object.constructor.name
    if(!_listeners[objectName] || !_listeners[objectName][listener]) {
        return false
    }
    let top = true
    let proto = object.__proto__
    while(proto) {
        objectName = proto.constructor.name
        if(_listeners[objectName] && _listeners[objectName][listener]) {
            _listeners[objectName][listener].forEach(callback => {
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
    let data = [false, false];
    for(let idx = 0; idx < keys.length; idx++) {
        if(ignore.indexOf(keys) !== -1) {
            continue;
        }
        if(layerData.properties && layerData.properties.hasOwnProperty(keys[idx])) {
            data[0] = true;
            data[1] = data[1] || _hideFunctions[keys[idx]](layerData);
        }
        if(data[1]) {
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
