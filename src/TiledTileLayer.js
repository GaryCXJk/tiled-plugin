import TiledTileShader from "./TiledTileShader";

export default class TiledTileLayer extends PIXI.tilemap.CompositeRectTileLayer {
    constructor(zIndex, bitmaps, useSquare, texPerChild) {
        super(zIndex, bitmaps, useSquare, texPerChild)
    }

    renderWebGL(renderer) {
        var gl = renderer.gl;
        if(!this.tiledTileShader) {
            this.tiledTileShader = new TiledTileShader(gl, renderer.plugins.tilemap.maxTextures, this.useSquare)
        }
        var alpha = this.alpha;
        var props = $gameMap.getLayerProperties(this.layerId);
        if(props.transition) {
            alpha-= props.minAlpha
            alpha*= (props.transitionPhase / props.transition)
            alpha+= props.minAlpha
        }
        //var shader = renderer.plugins.tilemap.getShader(this.useSquare);
        var shader = this.tiledTileShader;
        renderer.setObjectRenderer(renderer.plugins.tilemap);
        renderer.bindShader(shader);
        this._globalMat = this._globalMat || new PIXI.Matrix();
        renderer._activeRenderTarget.projectionMatrix.copy(this._globalMat).append(this.worldTransform);
        shader.uniforms.projectionMatrix = this._globalMat.toArray(true);
        shader.uniforms.shadowColor = this.shadowColor;
        shader.uniforms.alpha = alpha;
        if (this.useSquare) {
            var tempScale = this._tempScale = (this._tempScale || [0, 0]);
            tempScale[0] = this._globalMat.a >= 0 ? 1 : -1;
            tempScale[1] = this._globalMat.d < 0 ? 1 : -1;
            var ps = shader.uniforms.pointScale = tempScale;
            shader.uniforms.projectionScale = Math.abs(this.worldTransform.a) * renderer.resolution;
        }
        var af = shader.uniforms.animationFrame = renderer.plugins.tilemap.tileAnim;
        var layers = this.children;
        for (var i = 0; i < layers.length; i++) {
            layers[i].renderWebGL(renderer, this.useSquare);
        }
    }
}