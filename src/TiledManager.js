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

let _autoFunctions = {};

let _pluginCommands = {};

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

let _processEncoding = {
	base64: function(data) {
		let decodedData = atob(data);
		let newData = [];
		for (let idx = 0; idx < decodedData.length; idx+= 4) {
			newData.push(decodedData.charCodeAt(idx) | ((decodedData.charCodeAt(idx + 1) || 0) << 8) | ((decodedData.charCodeAt(idx + 2) || 0) << 16) | ((decodedData.charCodeAt(idx + 3) || 0) << 24));
		}
		return newData;
	}
};

let _registeredObjectResolvers = [];

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

    // Handle static classes such as managers
    let isStatic = object.constructor.name === "Function";
    let objectName = isStatic ? object.name : object.constructor.name;

    if(!_listeners[objectName] || !_listeners[objectName][event]) {
        return false
    }

    if (isStatic) {
        _listeners[objectName][event].forEach(callback => {
            if (top || callback.recursive) {
                callback.call(object, options)
            }
        })
    } else {
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

TiledManager.processTiledData = function(parentLayer = false) {
    if(!parentLayer) {
        parentLayer = $gameData.tiledData
    }
    if(!parentLayer) {
        return;
    }
    for(var idx = 0; idx < parentLayer.layers.length; idx++) {
        let layer = parentLayer.layers[idx];
        if(layer.type === 'group') {
			TiledManager.processTiledData(layer);
			Array.prototype.splice.apply(parentLayer.layers, [idx, 1].concat(layer.layers))
			idx+= layer.layers.length - 1;
        } else if(layer.type === 'tilelayer') {
			let encoding = layer.encoding || '';
			if(encoding && _processEncoding.hasOwnProperty(encoding)) {
				let encFunc = _processEncoding[encoding];
				if(layer.data) {
					layer.data = encFunc(layer.data);
				} else if(layer.chunks) {
					layer.chunks.forEach(chunk => {
						chunk.data = encFunc(chunk.data);
					});
				}
			}
        }

        // Trigger listener that a layer has been processed.
        TiledManager.triggerListener(TiledManager, "tiledlayerdataprocessed", layer, parentLayer);
    }
}

TiledManager.extractTileId = function(layerData, i) {
	if(layerData.data) {
		return layerData.data[i];
	} else {
		let x = i % $gameMap.width();
		let y = Math.floor(i / $gameMap.width());
		let offsets = $gameMap.offsets();
		x+= offsets.x;
		y+= offsets.y;
		if(x < layerData.startx || y < layerData.starty || x >= layerData.startx + layerData.width || y >= layerData.starty + layerData.height) {
			return 0;
		}
		for(let chunkIdx = 0; chunkIdx < layerData.chunks.length; chunkIdx++) {
			let chunk = layerData.chunks[chunkIdx];
			if(x < chunk.x || y < chunk.y || x >= chunk.x + chunk.width || y >= chunk.y + chunk.height) {
				continue;
			}
			return chunk.data[x - chunk.x + (y - chunk.y) * chunk.width];
		}
		return 0;
	}
}

/* TILE FLAGS */

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

TiledManager.setAutoFunction = function(identifier, functions = {}) {
    _autoFunctions[identifier] = functions;
}

TiledManager.getAutoFunction = function(identifier) {
    return _autoFunctions[identifier] || false;
}

/* Tiled Object Handlers */
TiledManager.objectResolvers = {};

/**
 * Registers an object resolver that will pre-process a tiled object.
 * The object resolver should return true if it processed the object, so then
 * other resolvers won't be called.
 * @param {(object, map)=>boolean} resolver
 */
TiledManager.registerTiledObjectResolver = function (resolver) {
    _registeredObjectResolvers.push(resolver);
}

/**
 * Object resolver for handling waypoints
 * @param {*} object 
 * @param {*} map 
 */
TiledManager.objectResolvers.waypoint = function (object, map) {
    if (object.properties && object.properties.waypoint) {

        let x = object.x / map.tileWidth();
        let y = object.y / map.tileHeight();
        if (pluginParams["Constrain Events to Grid"].toLowerCase() === "true") {
            x = Math.floor(x);
            y = Math.floor(y);
        }

        map._waypoints[object.properties.waypoint] = { x, y }
        return true;
    }
    return false;
}

/**
 * Object resolver for mapping to an existing event
 * @param {*} object 
 * @param {*} map 
 */
TiledManager.objectResolvers.eventId = function (object, map) {
    if (object.properties && object.properties.eventId) {
        let event;
        let eventId = parseInt(object.properties.eventId);
        event = map._events[eventId];

        if (event) {
            let x = object.x / map.tileWidth() - map._offsets.x;
            let y = object.y / map.tileHeight() - map._offsets.y;
            if (pluginParams["Constrain Events to Grid"].toLowerCase() === "true") {
                x = Math.floor(x);
                y = Math.floor(y);
            }
            if (map.isHalfTile()) {
                x += 1;
                y += 1;
            }

            event.locate(x, y);

            event._tiledProperties = object.properties;
            return true;
        }
    }

    return false;
}

/**
 * Object resolver for mapping a vehicle
 * @param {*} object 
 * @param {*} map 
 */
TiledManager.objectResolvers.vehicle = function (object, map) {
    if (object.properties && object.properties.eventId) {
        let event = map.vehicle(object.properties.vehicle);
        map._vehicles.push(object.properties.vehicle);

        if (event) {
            let x = object.x / map.tileWidth() - map._offsets.x;
            let y = object.y / map.tileHeight() - map._offsets.y;
            if (pluginParams["Constrain Events to Grid"].toLowerCase() === "true") {
                x = Math.floor(x);
                y = Math.floor(y);
            }
            if (map.isHalfTile()) {
                x += 1;
                y += 1;
            }

            event.loadSystemSettings();
            event.setLocation(this.mapId(), x, y);

            event._tiledProperties = object.properties;
            return true;
        }
    }

    return false;
}

TiledManager.registerStandardResolvers = function() {
    TiledManager.registerTiledObjectResolver(TiledManager.objectResolvers.waypoint);
    TiledManager.registerTiledObjectResolver(TiledManager.objectResolvers.eventId);
    TiledManager.registerTiledObjectResolver(TiledManager.objectResolvers.vehicle);
}

TiledManager.processTiledObject = function (object, map) {
    _registeredObjectResolvers.some(r => r(object, map));
}

/* PLUGIN COMMANDS */

TiledManager.addPluginCommand = function(command, func) {
    _pluginCommands[command] = func;
}

TiledManager.pluginCommand = function(command, args) {
    if(_pluginCommands.hasOwnProperty(command)) {
        _pluginCommands[command].call(this, args);
    }
}