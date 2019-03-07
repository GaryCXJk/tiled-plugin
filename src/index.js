import "./TilesetManager";
import "./DataManager";
import "./ImageManager";
import "./TiledManager";
import "./Sprite_TiledPriorityTile";
import "./AlphaFilter";
import { TiledTilemap } from "./TiledTilemap";
import "./Game_Map";
import "./Game_Screen";
import "./Game_CharacterBase";
import "./Game_Actor";
import "./Game_Player";
import "./Game_Vehicle";
import "./Game_Interpreter";
import "./Sprite_Character";
import "./Spriteset_Map";

/* INITIALIZES LISTENERS */

// Add floor damage while on a slippery floor
TiledManager.addListener(Game_Player, 'slipperyfloor', function(options) {
    const d = options.direction
    $gameParty.members().forEach(actor => {
        actor.checkFloorEffect();
    })
    this.moveStraight(d);
})

/* INITIALIZES HIDE FUNCTIONS */

TiledManager.addHideFunction('hideOnLevel', function(layerData) {
    /* Hide if player is on certain level */
    let level = $gameMap.currentMapLevel;
    let hideLayer = false;
    if(parseInt(layerData.properties.hideOnLevel) === level) {
        hideLayer = true;
    }
    return hideLayer;
});

TiledManager.addHideFunction('showOnLevel', function(layerData) {
    /* Show if player is on certain level */
    let level = $gameMap.currentMapLevel;
    let hideLayer = false;
    if(parseInt(layerData.properties.showOnLevel) !== level) {
        hideLayer = true;
    }
    return hideLayer;
});

TiledManager.addHideFunction('hideOnRegion', function(layerData) {
    /* Hide if player is on certain region */
    let regionId = $gamePlayer.regionId();
    let hideLayer = false;
    if(parseInt(layerData.properties.hideOnRegion) === regionId) {
        hideLayer = true;
    }
    return hideLayer;
}, ['regions'])

TiledManager.addHideFunction('hideOnRegions', function(layerData) {
    /* Hide if player is on certain region */
    let regionId = $gamePlayer.regionId();
    let hideLayer = false;
    if(layerData.properties.hideOnRegions.split(',').indexOf(String(regionId)) !== -1) {
        hideLayer = true;
    }
    return hideLayer;
}, ['regions'])

TiledManager.addHideFunction('hideOnAnyRegions', function(layerData) {
    /* Hide if player is on certain region */
    let regionIds = $gamePlayer.regionIds();
    let hideLayer = false;
    let regions = layerData.properties.hideOnRegions.split(',');
    if(regions.filter(region => regionIds.indexOf(region) > -1).length > 0) {
        hideLayer = true;
    }
    return hideLayer;
}, ['regions'])

TiledManager.addHideFunction('hideOnSwitch', function(layerData) {
    /* Hide if switch is on */
    let hideLayer = false;
    if($gameSwitches.value(layerData.properties.hideOnSwitch)) {
        hideLayer = true;
    }
    return hideLayer;
})

TiledManager.addHideFunction('showOnSwitch', function(layerData) {
    /* Show if switch is on */
    let hideLayer = false;
    if(!$gameSwitches.value(layerData.properties.showOnSwitch)) {
        hideLayer = true;
    }
    return hideLayer;
})

/* INITIALIZES FLAGS */

TiledManager.addFlag('boat', 'ship', 'airship')
TiledManager.addFlag('ladder', 'bush', 'counter', 'damage')
TiledManager.addFlag('ice', 'autoDown', 'autoLeft', 'autoRight', 'autoUp')
TiledManager.addFlag('heal')

/* INITIALIZES AUTO FUNCTIONS */

TiledManager.setAutoFunction('linear', {
    x: (x, y) => { return x; },
    y: (x, y) => { return y; }
})

TiledManager.setAutoFunction('sine', {
    x: (x, y) => { return Math.sin(x * Math.PI / 180); },
    y: (x, y) => { return Math.sin(y * Math.PI / 180); }
})

TiledManager.setAutoFunction('cosine', {
    x: (x, y) => { return Math.cos(x * Math.PI / 180); },
    y: (x, y) => { return Math.cos(y * Math.PI / 180); }
})

TiledManager.registerStandardResolvers();

/* INITIALIZES PLUGIN COMMANDS */

TiledManager.addPluginCommand('TiledTransferPlayer', function(args) {
    let mapId = parseInt(args[0]);
    let waypoint = args[1];
    let direction = args.length > 2 ? args[2] : 0;
    let fadeType = args.length > 3 ? args[3] : 2;
    if(isNaN(direction)) {
        switch(direction.toLowerCase()) {
            case 'down':
                direction = 2;
                break;
            case 'left':
                direction = 4;
                break;
            case 'right':
                direction = 6;
                break;
            case 'up':
                direction = 8;
                break;
            default:
                direction = 0;
                break;
        }
    } else {
        direction = parseInt(direction);
    }
    if(isNaN(fadeType)) {
        // Fix by FrillyWumpus
        switch(fadeType.toLowerCase()) {
            case 'black':
                fadeType = 0;
                break;
            case 'white':
                fadeType = 1;
                break;
            default:
                fadeType = 2;
                break;
        }
    } else {
        fadeType = parseInt(fadeType);
    }
    $gamePlayer.reserveTransfer(mapId, 0, 0, direction, fadeType, waypoint);
    this.setWaitMode('transfer');
})

TiledManager.addPluginCommand('TiledSetLevel', function (args) {
    $gameMap.currentMapLevel = parseInt(args[0]);
});

/* LOAD CUSTOM DATA FROM THE PARAMETERS */

TiledManager.getParameterFlags()

/* INITIALIZES VEHICLES (HAS TO BE RUN AFTER CONTENT IS READY) */

const initTiledManager = () => {
    document.removeEventListener('DOMContentLoaded', initTiledManager);
    window.removeEventListener('load', initTiledManager);
    TiledManager.createVehicle('boat', true);
    TiledManager.createVehicle('ship', true);
    TiledManager.createVehicle('airship', true);
    TiledManager.getParameterVehicles()
}

if (document.readyState === 'complete') {
    initTiledManager();
} else {
    document.addEventListener('DOMContentLoaded', initTiledManager);
    window.addEventListener('load', initTiledManager);
}