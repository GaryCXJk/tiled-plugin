import "./TilesetManager";
import "./DataManager";
import "./ImageManager";
import "./TiledManager";
import "./Sprite_TiledPriorityTile";
import "./AlphaFilter";
import { TiledTilemap } from "./TiledTilemap";
import "./Game_Map";
import "./Game_CharacterBase";
import "./Game_Player";
import "./Sprite_Character";
import "./Spriteset_Map";

/* INITIALIZES LISTENERS */

// Add floor damage while on a slippery floor
TiledManager.addListener(Game_Player, 'slipperyfloor', function(options) {
    const {d} = options
    $gameParty.members().forEach(actor => {
        actor.checkFloorEffect();
    })
    this.moveStraight(d);
})

/* INITIALIZES HIDE FUNCTIONS */

TiledManager.addHideFunction('hideOnRegion', function(layerData) {
    /* Hide if player is on certain region */
    let regionId = $gameMap.regionId($gamePlayer.x, $gamePlayer.y);
    let hideLayer = false;
    if(parseInt(layerData.properties.hideOnRegion) === regionId) {
        hideLayer = true;
    }
    return hideLayer;
}, ['regions'])

TiledManager.addHideFunction('hideOnRegions', function(layerData) {
    /* Hide if player is on certain region */
    let regionId = $gameMap.regionId($gamePlayer.x, $gamePlayer.y);
    let hideLayer = false;
    if(layerData.properties.hideOnRegions.split(',').indexOf(String(regionId)) !== -1) {
        hideLayer = true;
    }
    return hideLayer;
}, ['regions'])

TiledManager.addHideFunction('hideOnAnyRegions', function(layerData) {
    /* Hide if player is on certain region */
    let regionIds = $gameMap.regionIds($gamePlayer.x, $gamePlayer.y);
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
