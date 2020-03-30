import TiledTileShader from './TiledTileShader';

class TiledTileRenderer extends PIXI.tilemap.TileRenderer {
    onContextChange() {
        var gl = this.renderer.gl;
        var maxTextures = this.maxTextures;
        this.rectShader = new TiledTileShader(gl, maxTextures, false);
        this.squareShader = new TiledTileShader(gl, maxTextures, true);
        this.checkIndexBuffer(2000);
        this.rectShader.indexBuffer = this.indexBuffer;
        this.squareShader.indexBuffer = this.indexBuffer;
        this.vbs = {};
        this.glTextures = [];
        this.boundSprites = [];
        this.initBounds();
    }
}

PIXI.WebGLRenderer.registerPlugin('tilemap', TiledTileRenderer);
