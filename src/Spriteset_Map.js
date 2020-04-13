import TiledTilemap from "./TiledTilemap";

let _initialize = Spriteset_Battle.prototype.initialize
Spriteset_Battle.prototype.initialize = function() {
    this._parallaxContainers = {};
    _initialize.call(this);
}

let _createTilemap = Spriteset_Map.prototype.createTilemap;
Spriteset_Map.prototype.createTilemap = function () {
    if (!$gameMap.isTiledMap()) {
        _createTilemap.call(this);
        return;
    }
    this._tilemap = new TiledTilemap($gameMap.tiledData, $gameMap.layers);
    this._tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
    this._tilemap.verticalWrap = $gameMap.isLoopVertical();
    this.loadTileset();
    this._baseSprite.addChild(this._tilemap);
};

let _loadTileset = Spriteset_Map.prototype.loadTileset;
Spriteset_Map.prototype.loadTileset = function () {
    if (!$gameMap.isTiledMap()) {
        _loadTileset.call(this);
        return;
    }

    let i = 0;
    for (let tileset of $gameMap.tiledData.tilesets) {
        if(tileset.properties && tileset.properties.ignoreLoading) {
            continue;
        }
        if(tileset.image) {
            let bitmap = ImageManager.loadParserTileset(tileset.image, 0);
            this._tilemap.bitmaps.push(bitmap);
            this._tilemap.indexedBitmaps[i] = bitmap;
        } else {
            this._tilemap.indexedBitmaps[i] = [];
            for(let tile = 0; tile < tileset.tilecount; tile++) {
                if(tileset.tiles[tile]) {
                    let bitmap = ImageManager.loadParserTileset(tileset.tiles[tile].image, 0);
                    this._tilemap.bitmaps.push(bitmap);
                    this._tilemap.indexedBitmaps[i][tile] = bitmap;
                }
            }
        }
        i++;
    }
    this._tilemap.refreshTileset();
    this._tileset = $gameMap.tiledData.tilesets;
};

let _update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function () {
    _update.call(this);
    //Disabed updateHideOnLevel, since it got moved to the general layer hide functions
    //this._updateHideOnLevel();
    this._updateHideOnSpecial();
    this._tilemap.updateImageLayer();
};

Spriteset_Map.prototype.updateTileset = function () {
    if (this._tileset !== $gameMap.tiledData.tilesets) {
        this.loadTileset();
    }
};

Spriteset_Map.prototype._updateHideOnLevel = function () {
    this._tilemap.hideOnLevel($gameMap.currentMapLevel);
};

Spriteset_Map.prototype._updateHideOnSpecial = function () {
    if($gamePlayer && $gameMap) {
        this._tilemap.hideOnSpecial();
    }
};
