const pluginParams = PluginManager.parameters("YED_Tiled");
DataManager._tempTiledData = null;
DataManager._tiledLoaded = false;

const loadMapData = DataManager.loadMapData;


DataManager.loadMapData = function (mapId) {
    loadMapData.call(this, mapId);
    if (mapId > 0) {
        this.loadTiledMapData(mapId);
    } else {
        this.unloadTiledMapData();
    }
};

const tilesetLoaded = (idx, tileset) => {
    DataManager._tempTiledData.tilesets[idx] = Object.assign({}, tileset, {firstgid: DataManager._tempTiledData.tilesets[idx].firstgid});
};

DataManager.loadTiledMapData = function (mapId) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', "./" + TiledManager.getParam('Maps Location', 'maps/') + "Map" + mapId + ".json");
    xhr.overrideMimeType('application/json');

    // on success callback
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.responseText !== "") {
                DataManager._tempTiledData = JSON.parse(xhr.responseText);
                TiledManager.processTiledData(DataManager._tempTiledData);
                TiledManager.triggerListener(TiledManager, "tiledmapdataprocessed", DataManager._tempTiledData, mapId);
            }
            let tiledLoaded = true;
            if(DataManager._tempTiledData && DataManager._tempTiledData.tilesets && DataManager._tempTiledData.tilesets.length > 0) {
                for(var idx = 0; idx < DataManager._tempTiledData.tilesets.length; idx++) {
                    let tileset = DataManager._tempTiledData.tilesets[idx];
                    if(tileset.source) {
                        TilesetManager.loadTileset(tileset.source, tilesetLoaded.bind(null, idx));
                    }
                }
            }
            DataManager._tiledLoaded = tiledLoaded;
        }
    };

    // set data to null and send request
    this.unloadTiledMapData();
    xhr.send();
};

DataManager.unloadTiledMapData = function () {
    DataManager._tempTiledData = null;
    DataManager._tiledLoaded = false;

    if ((pluginParams["Unload tilesets on map switch"] || 'true').toLowerCase() === "true") {
        TilesetManager.unload();
    }
};

let _isMapLoaded = DataManager.isMapLoaded;
DataManager.isMapLoaded = function() {
    let defaultLoaded = _isMapLoaded.call(this);
    let tiledLoaded = DataManager._tiledLoaded;
    let tilesetLoaded = TilesetManager.isReady();

    return defaultLoaded && tiledLoaded && tilesetLoaded;
};