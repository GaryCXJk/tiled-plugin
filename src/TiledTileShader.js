const GLBuffer = PIXI.glCore.GLBuffer;
const VertexArrayObject = PIXI.glCore.VertexArrayObject;

var squareShaderFrag = `
varying vec2 vTextureCoord;
varying float vSize;
varying float vTextureId;

uniform vec4 shadowColor;
uniform sampler2D uSamplers[%count%];
uniform vec2 uSamplerSize[%count%];
uniform vec2 pointScale;
uniform float uAlpha;

void main(void){
   float margin = 0.5 / vSize;
   vec2 pointCoord = (gl_PointCoord - 0.5) * pointScale + 0.5;
   vec2 clamped = vec2(clamp(pointCoord.x, margin, 1.0 - margin), clamp(pointCoord.y, margin, 1.0 - margin));
   vec2 textureCoord = pointCoord * vSize + vTextureCoord;
   float textureId = vTextureId;
   vec4 color;
   %forloop%
   gl_FragColor = color * uAlpha;
}
`

var squareShaderVert = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec2 aAnim;
attribute float aTextureId;
attribute float aSize;

uniform mat3 projectionMatrix;
uniform vec2 samplerSize;
uniform vec2 animationFrame;
uniform float projectionScale;

varying vec2 vTextureCoord;
varying float vSize;
varying float vTextureId;

void main(void){
   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition + aSize * 0.5, 1.0)).xy, 0.0, 1.0);
   gl_PointSize = aSize * projectionScale;
   vTextureCoord = aTextureCoord + aAnim * animationFrame;
   vTextureId = aTextureId;
   vSize = aSize;
}
`
var rectShaderFrag = `
varying vec2 vTextureCoord;
varying vec4 vFrame;
varying float vTextureId;
uniform vec4 shadowColor;
uniform sampler2D uSamplers[%count%];
uniform vec2 uSamplerSize[%count%];
uniform float uAlpha;
void main(void){
   vec2 textureCoord = clamp(vTextureCoord, vFrame.xy, vFrame.zw);
   float textureId = floor(vTextureId + 0.5);
   vec4 color;
   %forloop%
   gl_FragColor = color * uAlpha;
}
`;

var rectShaderVert = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aFrame;
attribute vec2 aAnim;
attribute float aTextureId;
uniform mat3 projectionMatrix;
uniform vec2 animationFrame;
varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vFrame;
void main(void){
   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
   vec2 anim = aAnim * animationFrame;
   vTextureCoord = aTextureCoord + anim;
   vFrame = aFrame + vec4(anim, anim);
   vTextureId = aTextureId;
}
`;
export default class TiledTileShader extends PIXI.tilemap.TilemapShader {

    constructor(gl, maxTextures, useSquare) {
        let vert = useSquare ? squareShaderVert : rectShaderVert;
        let frag = useSquare ? squareShaderFrag : rectShaderFrag;
        super(gl,
            maxTextures,
            vert,
            PIXI.tilemap.shaderGenerator.generateFragmentSrc(maxTextures, frag)
        );
        if(useSquare) {
            this.vertSize = 8;
            this.vertPerQuad = 1;
            this.anim = 5;
            this.textureId = 7;
        } else {
            this.vertSize = 11;
            this.vertPerQuad = 4;
            this.anim = 8;
            this.textureId = 10;
        }
        this.maxTextures = maxTextures;
        this.stride = this.vertSize * 4;
        this.useSquare = useSquare;
        PIXI.tilemap.shaderGenerator.fillSamplers(this, this.maxTextures);
    }

    createVao(renderer, vb) {
        return this.useSquare ? this.createVaoSquare(renderer, vb) : this.createVaoRect(renderer, vb);
    }

    createVaoRect(renderer, vb) {
        var gl = renderer.gl;
        return renderer.createVao()
            .addIndex(this.indexBuffer)
            .addAttribute(vb, this.attributes.aVertexPosition, gl.FLOAT, false, this.stride, 0)
            .addAttribute(vb, this.attributes.aTextureCoord, gl.FLOAT, false, this.stride, 2 * 4)
            .addAttribute(vb, this.attributes.aFrame, gl.FLOAT, false, this.stride, 4 * 4)
            .addAttribute(vb, this.attributes.aAnim, gl.FLOAT, false, this.stride, this.anim * 4)
            .addAttribute(vb, this.attributes.aTextureId, gl.FLOAT, false, this.stride, this.textureId * 4);
    }

    createVaoSquare(renderer, vb) {
        var gl = renderer.gl;
        return renderer.createVao()
            .addIndex(this.indexBuffer)
            .addAttribute(vb, this.attributes.aVertexPosition, gl.FLOAT, false, this.stride, 0)
            .addAttribute(vb, this.attributes.aTextureCoord, gl.FLOAT, false, this.stride, 2 * 4)
            .addAttribute(vb, this.attributes.aSize, gl.FLOAT, false, this.stride, 4 * 4)
            .addAttribute(vb, this.attributes.aAnim, gl.FLOAT, false, this.stride, 5 * 4)
            .addAttribute(vb, this.attributes.aTextureId, gl.FLOAT, false, this.stride, 7 * 4);
    }
}