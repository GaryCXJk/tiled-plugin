//-----------------------------------------------------------------------------
// Sprite_TiledPriorityTile
//
// The sprite for displaying a priority tile.

function Sprite_TiledPriorityTile() {
    this.initialize.apply(this, arguments);
}

Sprite_TiledPriorityTile.prototype = Object.create(Sprite_Base.prototype);
Sprite_TiledPriorityTile.prototype.constructor = Sprite_TiledPriorityTile;

window.Sprite_TiledPriorityTile = Sprite_TiledPriorityTile;

Sprite_TiledPriorityTile.prototype.updateVisibility = function() {
    let visibility = false;
    if(this.layerId > -1) {
        visibility = true;
        let props = $gameMap.getLayerProperties(this.layerId);
        if(props.transition) {
            visibility = props.minAlpha > 0 || props.transitionPhase > 0;
            this.opacity = 255 * (((props.baseAlpha - props.minAlpha) * (props.transitionPhase / props.transition)) + props.minAlpha);
        } else {
            let layer = $gameMap.tiledData.layers[this.layerId];
            visibility = !TiledManager.checkLayerHidden(layer);
        }
    }
    this.visible = visibility;
};
