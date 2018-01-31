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
    let visibility = true;
    if(this.layerId > -1) {
        let layer = $gameMap.tiledData.layers[this.layerId];
        if(layer.properties.transition) {
            if(!this._transition) {
                this._transition = layer.properties.transition;
                this._baseAlpha = layer.opacity;
                this._minAlpha = Math.min(this._baseAlpha, (layer.properties.minimumOpacity || 0));
                this._isShown = !TiledManager.checkLayerHidden(layer)[1];
                this._transitionPhase = this._isShown ? this._transition : 0
            } else {
                this._isShown = !TiledManager.checkLayerHidden(layer)[1];
                this._transitionPhase = Math.max(0, Math.min(this._transition, this._transitionPhase + (this._isShown ? 1 : -1)));
            }
            visibility = this._minAlpha > 0 || this._transitionPhase > 0;
            this.opacity = 255 * (((this._baseAlpha - this._minAlpha) * (this._transitionPhase / this._transition)) + this._minAlpha);
        }
    }
    this.visible = visibility;
};
