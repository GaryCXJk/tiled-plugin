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
    this.visible = this.layerId === -1 || !TiledManager.checkLayerHidden($gameMap.tiledData.layers[this.layerId])[1];
};
