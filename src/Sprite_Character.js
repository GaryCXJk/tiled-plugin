let _update = Sprite_Character.prototype.update
Sprite_Character.prototype.update = function() {
	_update.call(this);
	this.locationHeight = this._character.locationHeight();
}