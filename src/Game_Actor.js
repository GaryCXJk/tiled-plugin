// Constants
let pluginParams = PluginManager.parameters("YED_Tiled");

let _checkFloorEffect = Game_Actor.prototype.checkFloorEffect;
Game_Actor.prototype.checkFloorEffect = function() {
    _checkFloorEffect.call(this);
    if ($gamePlayer.isOnHealFloor()) {
        this.executeFloorHeal();
    }
}

Game_Actor.prototype.executeFloorHeal = function() {
    var heal = Math.floor(this.basicFloorHeal() * this.fdr);
    heal = Math.min(heal, this.maxFloorHeal());
    this.gainHp(heal);
    if (heal > 0) {
        this.performMapHeal();
    }
};

Game_Actor.prototype._getFloorHPCalculation = function(type = 'damage') {
    let typeName = type.slice(0, 1).toUpperCase() + type.slice(1).toLowerCase();
    let floorHP = [];
    for(var layerId = 0; layerId < $gameMap.tiledData.layers; layerId++) {
        let layerData = $gameMap.tiledData.layers[layerId];
        if(!layerData.properties) {
            return;
        }
        let level = parseInt(layerData.properties.level) || 0;
        if(level !== $gameMap.currentMapLevel) {
            return;
        }
        if(TiledManager.checkLayerHidden(layerData)) {
            return;
        }
        let tile = Game_Map.prototype.getTileProperties(x, y, layerId);
        if(!!tile.properties && !!tile.properties['floor' + typeName]) {
            floorHP.push(layerData.properties['floor' + typeName]);
        }
    }
    let actualHP = 0;
    switch((pluginParams["Floor HP Calculation"] || '').toLowerCase()) {
        case 'sum':
            floorHP.forEach(hp => {
                actualHP+= hp;
            })
            break;
        case 'average':
            floorHP.forEach(hp => {
                actualHP+= hp;
            })
            actualHP = Math.round(actualHP / floorHP.length);
            break;
        case 'top':
        default:
            actualHP = floorHP.pop();
            break;
    }
    return actualHP;
}

Game_Actor.prototype.basicFloorDamage = function() {
    let actualDamage = this._getFloorHPCalculation('damage');
    return actualDamage || parseInt(pluginParams["Basic Floor Damage"]) || 10;
};

Game_Actor.prototype.basicFloorHeal = function() {
    let actualHeal = this._getFloorHPCalculation('heal');
    return actualHeal || parseInt(pluginParams["Basic Floor Heal"]) || 10;
};

Game_Actor.prototype.maxFloorHeal = function() {
    return Math.max(this.mhp - this.hp, 0);
};

Game_Actor.prototype.performMapHeal = function() {
    if (!$gameParty.inBattle()) {
        $gameScreen.startFlashForHeal();
    }
};
