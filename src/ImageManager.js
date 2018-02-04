ImageManager.loadParserTileset = function (path, hue) {
    if (!path) {
        return this.loadEmptyBitmap();
    }
    let paths = path.split("/");
    while(paths[0] === '..') {
        paths.shift();
    }
    let filename = paths[paths.length - 1];
    let realPath = "img/tilesets/" + filename;
    if(paths[0] === 'img') {
        realPath = paths.slice(0, -1).join('/') + '/' + filename;
    }

    return this.loadNormalBitmap(realPath, hue);
};

ImageManager.loadParserParallax = function (path, hue) {
    if (!path) {
        return this.loadEmptyBitmap();
    }
    let paths = path.split("/");
    while(paths[0] === '..') {
        paths.shift();
    }
    let filename = paths[paths.length - 1];
    let realPath = "img/parallaxes/" + filename;
    if(paths[0] === 'img') {
        realPath = paths.slice(0, -1).join('/') + '/' + filename;
    }

    return this.loadNormalBitmap(realPath, hue);
};