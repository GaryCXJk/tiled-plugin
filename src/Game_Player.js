let _checkEventTriggerHere = Game_Player.prototype.checkEventTriggerHere;
Game_Player.prototype.checkEventTriggerHere = function (triggers) {
    _checkEventTriggerHere.call(this, triggers);
    this._checkMapLevelChangingHere();
};

Game_Player.prototype._checkMapLevelChangingHere = function () {
    $gameMap.checkMapLevelChanging(this.x, this.y);
};

Game_Player.prototype.isOnHealFloor = function() {
    return $gameMap.isHealFloor(this.x, this.y) && !this.isInAirship();
};

let _getOnVehicle = Game_Player.prototype.getOnVehicle
Game_Player.prototype.getOnVehicle = function() {
    if(!$gameMap.isTiledMap()) {
        return _getOnVehicle.call(this);
    }
    var direction = this.direction();
    var x1 = this.x;
    var y1 = this.y;
    var x2 = $gameMap.roundXWithDirection(x1, direction);
    var y2 = $gameMap.roundYWithDirection(y1, direction);
    if ($gameMap.airship().pos(x1, y1)) {
        this._vehicleType = 'airship';
    } else if ($gameMap.ship().pos(x2, y2)) {
        this._vehicleType = 'ship';
    } else if ($gameMap.boat().pos(x2, y2)) {
        this._vehicleType = 'boat';
    } else {
        let vehicles = $gameMap.vehicles(true);
        vehicles.forEach(vehicleName => {
            let vehicle = $gameMap.vehicle(vehicleName);
            if(vehicle.vehicleData) {
                if(!vehicle.vehicleData.hasOwnProperty('hasCollision') || vehicle.vehicleData.hasCollision === 'true' || vehicle.vehicleData.hasCollision === true) {
                    if(vehicle.pos(x2, y2)) {
                        this._vehicleType = vehicleName;
                    }
                } else {
                    if(vehicle.pos(x1, y1)) {
                        this._vehicleType = vehicleName;
                    }
                }
            } else if(vehicle.pos(x2, y2)) {
                this._vehicleType = vehicleName;
            }
        })
    }
    if (this.isInVehicle()) {
        this._vehicleGettingOn = true;
        if (!this.isInAirship()) {
            this.forceMoveForward();
        }
        this.gatherFollowers();
    }
    return this._vehicleGettingOn;
};

let _isInVehicle = Game_Player.prototype.isInVehicle
Game_Player.prototype.isInVehicle = function() {
    if(!$gameMap.isTiledMap()) {
        return _isInVehicle.call(this);
    }
    return $gameMap.vehicles(true).indexOf(this._vehicleType) > -1;
};
