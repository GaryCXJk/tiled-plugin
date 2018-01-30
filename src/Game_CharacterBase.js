Game_CharacterBase.prototype.screenZ = function () {
    let pluginParams = PluginManager.parameters("YED_Tiled");
    if (this._priorityType == 0) {
        return parseInt(pluginParams["Z - Below Player"]);
    }
    if (this._priorityType == 2) {
        return parseInt(pluginParams["Z - Above Player"]);
    }
    return parseInt(pluginParams["Z - Player"]);
};

let _distancePerFrame = Game_CharacterBase.prototype.distancePerFrame;
Game_CharacterBase.prototype.distancePerFrame = function () {
    let distance = _distancePerFrame.call(this);
    return distance * (48 / Math.min($gameMap.tileWidth(), $gameMap.tileHeight()));
};

let _refreshBushDepth = Game_CharacterBase.prototype.refreshBushDepth;
Game_CharacterBase.prototype.refreshBushDepth = function() {
    this._bushDepth = 0;
    if(!$gameMap.isTiledMap() || $gameMap.isTiledInitialized()) {
        _refreshBushDepth.call(this);
    } else {
        $gameMap.setRefreshDepth(this);
    }
};

let _updateMove = Game_CharacterBase.prototype.updateMove;
Game_CharacterBase.prototype.updateMove = function() {
    var hori = (this._realX > this._x ? 4 : (this._realX < this._x ? 6 : 0))
    var vert = (this._realY > this._y ? 8 : (this._realY < this._y ? 2 : 0))
    var d = hori + vert
    _updateMove.call(this);
    if(!this.isMoving() && $gameMap.isSlipperyFloor(this._x, this._y)) {
        TiledManager.triggerListener(this, 'slipperyfloor', {
            d
        })
    }
}

Game_CharacterBase.prototype.locationHeight = function() {
	return this._locationHeight || 0
}