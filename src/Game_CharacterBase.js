const pluginParams = PluginManager.parameters("YED_Tiled");

const _initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function () {
    _initMembers.call(this);
    this.reflections = [];
};

Game_CharacterBase.prototype.screenZ = function () {
    if (this._priorityType == 0) {
        return parseInt(TiledManager.getParam('Z - Below Player', '1'));
    }
    if (this._priorityType == 2) {
        return parseInt(TiledManager.getParam('Z - Above Player', '5'));
    }
    return parseInt(TiledManager.getParam('Z - Player', '3'));
};

const _distancePerFrame = Game_CharacterBase.prototype.distancePerFrame;
Game_CharacterBase.prototype.distancePerFrame = function () {
    const distance = _distancePerFrame.call(this);
    return distance * (48 / Math.min($gameMap.tileWidth(), $gameMap.tileHeight()));
};

const _refreshBushDepth = Game_CharacterBase.prototype.refreshBushDepth;
Game_CharacterBase.prototype.refreshBushDepth = function() {
    if(!this.hasOwnProperty('_bushDepth')) {
        this._bushDepth = 0;
    }
    if(!$gameMap.isTiledMap() || $gameMap.isTiledInitialized()) {
        _refreshBushDepth.call(this);
    } else {
        $gameMap.setRefreshDepth(this);
    }
};

const _updateMove = Game_CharacterBase.prototype.updateMove;
Game_CharacterBase.prototype.updateMove = function() {
    var hori = (this._realX > this._x ? 4 : (this._realX < this._x ? 6 : 0))
    var vert = (this._realY > this._y ? 8 : (this._realY < this._y ? 2 : 0))
    var d = hori + vert
    _updateMove.call(this);
    if(!this.isMoving() || pluginParams["Position Height - Always Check On Move Update"].toLowerCase() === "true") {
        let newLocationHeight = $gameMap.checkPositionHeight(this._x, this._y);
        if(newLocationHeight > -1) {
            this._locationHeight = newLocationHeight;
        }
    }
    if(!this.isMoving()) {
        TiledManager.triggerListener(this, 'stopmovement', {
            direction: d
        })
        if($gameMap.isSlipperyFloor(this._x, this._y)) {
            TiledManager.triggerListener(this, 'slipperyfloor', {
                direction: d
            })
        }
    }
}

const _update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {
    _update.call(this);
    this.updateReflection();
};

Game_CharacterBase.prototype.updateReflection = function() {
    if (!$gameMap.isOnReflection(this)) {
        this.reflections = [];
        return;
    }
    this.reflections = $gameMap.getReflections(this);
};

Game_CharacterBase.prototype.locationHeight = function() {
	return this._locationHeight || 0
}

const _isCollideWithVehicles = Game_CharacterBase.prototype.isCollidedWithVehicles
Game_CharacterBase.prototype.isCollidedWithVehicles = function(x, y) {
    if(!_isCollideWithVehicles.call(this, x, y)) {
        let vehicles = $gameMap.vehicles();
        for(let i = 0; i < vehicles.length; i++) {
            if(!(vehicles[i].vehicleData && (!vehicles[i].vehicleData.hasOwnProperty('hasCollision') || vehicles[i].vehicleData.hasCollision === 'true' || vehicles[i].vehicleData.hasCollision === true)) || vehicles[i].posNt(x, y)) {
                return true;
            }
        }
        return false;
    }
    return true;
};

Game_CharacterBase.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
    var x1 = lastScrolledX;
    var y1 = lastScrolledY;
    var x2 = this.scrolledX();
    var y2 = this.scrolledY();
    if (y2 > y1 && y2 > this.centerY()) {
        $gameMap.scrollDown(y2 - y1);
    }
    if (x2 < x1 && x2 < this.centerX()) {
        $gameMap.scrollLeft(x1 - x2);
    }
    if (x2 > x1 && x2 > this.centerX()) {
        $gameMap.scrollRight(x2 - x1);
    }
    if (y2 < y1 && y2 < this.centerY()) {
        $gameMap.scrollUp(y1 - y2);
    }
};
