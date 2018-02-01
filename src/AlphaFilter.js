/* A fallback implementation of AlphaFilter */

const fragmentSrc = 'varying vec2 vTextureCoord;' +
'uniform sampler2D uSampler;' +
'uniform float uAlpha;' +
'void main(void)' +
'{' +
'   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;' +
'}';

if(!PIXI.filters.AlphaFilter) {
    class AlphaFilter extends PIXI.Filter
    {
        /**
         * @param {number} [alpha=1] Amount of alpha from 0 to 1, where 0 is transparent
         */
        constructor(alpha = 1.0)
        {
            super(
                // vertex shader
                null,
                // fragment shader
               fragmentSrc
            );
            this.alpha = alpha;
            this.glShaderKey = 'alpha';
        }
        /**
         * Coefficient for alpha multiplication
         *
         * @member {number}
         * @default 1
         */
        get alpha()
        {
            return this.uniforms.uAlpha;
        }
        set alpha(value) // eslint-disable-line require-jsdoc
        {
            this.uniforms.uAlpha = value;
        }
    }
    PIXI.filters.AlphaFilter = AlphaFilter;
}