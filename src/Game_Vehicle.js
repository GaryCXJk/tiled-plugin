const _initialize = Game_Vehicle.prototype.initialize;
Game_Vehicle.prototype.initialize = function(type, vehicleData = false) {
    if(vehicleData) {
        this.vehicleData = vehicleData;
    }
    _initialize.call(this, type);
};

const _initMoveSpeed = Game_Vehicle.prototype.initMoveSpeed
Game_Vehicle.prototype.initMoveSpeed = function() {
    _initMoveSpeed.call(this);
    if(!!this.vehicleData && this.vehicleData.moveSpeed) {
        this.setMoveSpeed(parseInt(this.vehicleData.moveSpeed));
    }
};

let _vehicle = Game_Vehicle.prototype.vehicle
Game_Vehicle.prototype.vehicle = function() {
    var vehicleData = _vehicle.call(this);
    if(!vehicleData && !!this.vehicleData) {
        return this.vehicleData;
    }
    return vehicleData;
};

let _isMapPassable = Game_Vehicle.prototype.isMapPassable
Game_Vehicle.prototype.isMapPassable = function(x, y, d, render = false) {
    if(!$gameMap.isTiledMap()) {
        return _isMapPassable.call(this, x, y, d);
    }
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    if (this.isBoat()) {
        return $gameMap.isBoatPassable(x2, y2, render);
    } else if (this.isShip()) {
        return $gameMap.isShipPassable(x2, y2, render);
    } else if (this.isAirship()) {
        return true;
    } else {
        var vehicleData = this.vehicle();
        if(!!vehicleData) {
            if(!!vehicleData.tileFlag) {
                return $gameMap.checkHasTileFlag(x2, y2, vehicleData.tileFlag, render);
            }
            if(vehicleData.tileFlag === '') {
                return true;
            }
        }
        return false;
    }
};

Game_Vehicle.prototype.loadSystemSettings = function() {
    var vehicle = (window.$dataSystem ? this.vehicle() : null);
    if(vehicle) {
        this._mapId = vehicle.startMapId;
        this.setPosition(vehicle.startX, vehicle.startY);
        this.setImage(vehicle.characterName, vehicle.characterIndex);
    }
};

let _resetDirection = Game_Vehicle.prototype.resetDirection
Game_Vehicle.prototype.resetDirection = function() {
    if(!!this.vehicleData && !!this.vehicleData.direction) {
        this.setDirection(parseInt(this.vehicleData.direction));
    } else {
        _resetDirection.call(this)
    }
};

Game_Vehicle.prototype.getOff = function() {
    this._driving = false;
    this.setWalkAnime(false);
    this.setStepAnime(false);
    if(!this.vehicleData || !this.vehicleData.hasOwnProperty('resetDirection') || this.vehicleData.resetDirection === 'true') {
        this.resetDirection();
    }
    $gameSystem.replayWalkingBgm();
};
