const pluginParams = PluginManager.parameters("YED_Tiled");
//-----------------------------------------------------------------------------
// TilesetManager
//
// The static class that manages the TileD tilesets.

function TilesetManager() {
    throw new Error('This is a static class');
}

window.TilesetManager = TilesetManager;
TilesetManager.tilesets = {};

let tilesetLoading = 0;

const _getFilename = (path) => {
    let paths = path.split("/");
    return paths[paths.length - 1];
};

const _getRealPath = (path) => {
    return pluginParams["Tilesets Location"] + _getFilename(path);
};

TilesetManager.getTileset = function(path) {
    return TilesetManager.tilesets[_getFilename(path)];
};

TilesetManager.loadTileset = function(path, callback = false) {
    if (TilesetManager.tilesets[_getFilename(path)]) {
        if (callback) {
            callback(TilesetManager.tilesets[_getFilename(path)]);
        }
    }
    let realPath = _getRealPath(path);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './' + realPath);
    xhr.overrideMimeType('application/json');

    tilesetLoading++;

    // on success callback
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            tilesetLoading--;
            let tileset = false;
            if (xhr.status === 200 || xhr.responseText !== "") {
                tileset = JSON.parse(xhr.responseText);
                TilesetManager.tilesets[_getFilename(path)] = tileset;
            }
            if(callback) {
                callback(tileset);
            }
        }
    };

    // send request
    xhr.send();
};

TilesetManager.isReady = () => {
    return !tilesetLoading;
}

TilesetManager.unload = () => {
    TilesetManager.tilesets = {};
}
