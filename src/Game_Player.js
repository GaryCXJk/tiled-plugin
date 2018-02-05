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
