export default class TiledMapImage {
    constructor(layer) {
        this.name = layer.name;
        this.x = layer.x;
        this.y = layer.y;
        this.z = 0;
        this.offsetX = layer.offsetx || 0;
        this.offsetY = layer.offsety || 0;
        this.image = layer.image;
        this.opacity = layer.opacity;
        this.autoX = 0;
        this.autoY = 0;
        this.deltaX = 1;
        this.deltaY = 1;
        this.repeatX = false;
        this.repeatY = false;
        this.viewportX = 0;
        this.viewportY = 0;
        this.viewportWidth = 0;
        this.viewportHeight = 0;
        this.viewportDeltaX = 0;
        this.viewportDeltaY = 0;
        this.ignoreLoading = false;
        if (layer.properties) {
            [
                'autoX',
                'autoY',
                'deltaX',
                'deltaY',
                'repeatX',
                'repeatY',
                'viewportX',
                'viewportY',
                'viewportWidth',
                'viewportHeight',
                'viewportDeltaX',
                'viewportDeltaY',
                'hue',
                'ignoreLoading',
            ].forEach((prop => {
                if (typeof layer.properties[prop] !== 'undefined') {
                    this[prop] = layer.properties[prop];
                }
            }));

            this.z = layer.z || layer.properties.zIndex || this.z;
        }
        this.visible = layer.visible;
    }

    get baseX() {
        return this.x + this.offsetX;
    }

    get baseY() {
        return this.y + this.offsetY;
    }
}