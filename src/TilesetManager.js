//-----------------------------------------------------------------------------
// TilesetManager
//
// The static class that manages the TileD tilesets.

function TilesetManager() {
    throw new Error('This is a static class');
}

window.TilesetManager = TilesetManager;
TilesetManager.tilesets = {};

let _getFilename = function(path) {
    let paths = path.split("/");
    return paths[paths.length - 1];
};

let _getRealPath = function(path) {
    let pluginParams = PluginManager.parameters("YED_Tiled");
    return pluginParams["Tilesets Location"] + _getFilename(path);
};

TilesetManager.getTileset = function(path) {
    let realPath = _getRealPath(path);
    return TilesetManager.tilesets[_getFilename(path)];
};

TilesetManager.loadTileset = function(path, callback = false) {
    let realPath = _getRealPath(path);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './' + realPath);
    xhr.overrideMimeType('application/json');

    // on success callback
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
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
