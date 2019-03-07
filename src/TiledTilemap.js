import { getProperty } from './helpers'
import TiledTileLayer from "./TiledTileLayer";

let pluginParams = PluginManager.parameters("YED_Tiled");
/**
 * This class handles the tilemap
 */
export class TiledTilemap extends ShaderTilemap {
    initialize(tiledData) {
        this.indexedBitmaps = [];
        this._tiledData = {};
        this._layers = [];
        this._imageLayers = [];
        this._objectTiles = [];
        this._priorityTiles = [];
        this._priorityTilesCount = 0;
        this.tiledData = tiledData;
        super.initialize();
        this.setupTiled();
    }

    get tiledData() {
        return this._tiledData;
    }

    set tiledData(val) {
        this._tiledData = val;
        this.setupTiled();
    }

    setupTiled() {
        this._setupSize();
        this._setupAnim();
    }

    _setupSize() {
        let width = this._width;
        let height = this._height;
        let margin = this._margin;
        let tileCols = Math.ceil(width / this._tileWidth) + 1;
        let tileRows = Math.ceil(height / this._tileHeight) + 1;
        this._tileWidth = this.tiledData.tilewidth;
        this._tileHeight = this.tiledData.tileheight;
        this._layerWidth = tileCols * this._tileWidth;
        this._layerHeight = tileRows * this._tileHeight;
        this._mapWidth = this.tiledData.width;
        this._mapHeight = this.tiledData.height;
    }

    _setupAnim() {
        this._animFrame = {};
        this._animDuration = {};
    }

    _createLayers() {
        let id = 0;
        this._needsRepaint = true;

        let parameters = PluginManager.parameters('ShaderTilemap');
        let useSquareShader = Number(parameters.hasOwnProperty('squareShader') ? parameters['squareShader'] : 1);

        for (let layerData of this.tiledData.layers) {
            let zIndex = 0;
            const properties = layerData.properties;

            if (layerData.type === "imagelayer") {
                this._createImageLayer(layerData, id);
                id++;
                continue;
            }
            if (layerData.type != "tilelayer") {
                id++;
                continue;
            }

            if (!!getProperty(properties, 'zIndex')) {
                zIndex = parseInt(getProperty(properties, 'zIndex'));
            }

            if (!!getProperty(properties, 'collision')) {
                id++;
                continue;
            }

            if (!!getProperty(properties, 'toLevel')) {
                id++;
                continue;
            }

            if (!!getProperty(properties, 'regionId')) {
                id++;
                continue;
            }

            if (getProperty(properties, 'tileFlags') === 'hide') {
                id++;
                continue;
            }

            if (this._isReflectLayer(layerData)) {
                id++;
                continue;
            }

            let layer = new TiledTileLayer(zIndex, [], useSquareShader, 32);
            layer.layerId = id; // @dryami: hack layer index
            layer.spriteId = Sprite._counter++;
            layer.alpha = layerData.opacity;
            this._layers.push(layer);
            this.addChild(layer);
            id++;
        }

        this._createPriorityTiles();
    }

    _createPriorityTiles() {
        let size = parseInt(pluginParams["Priority Tiles Limit"]);
        let zIndex = parseInt(pluginParams["Z - Player"]);
        if(size > 0) {
            for (let x of Array(size).keys()) {
                let sprite = new Sprite_TiledPriorityTile();
                sprite.z = sprite.zIndex = zIndex;
                sprite.layerId = -1;
                sprite.hide();
                this.addChild(sprite);
                this._priorityTiles.push(sprite);
            }
        }
    }

    _isReflectLayer(layerData) {
        const properties = layerData.properties;
        return !!properties && (
            getProperty(properties, 'reflectionSurface')
            || getProperty(properties, 'reflectionCast')
        );
    }

    _hackRenderer(renderer) {
        return renderer;
    }

    refreshTileset() {
        var bitmaps = this.indexedBitmaps.map(function (x) {
            if(Array.isArray(x)) {
                return x.map(function(y) {
                    return y._baseTexture ? new PIXI.Texture(y._baseTexture) : y;
                })
            }
            return x._baseTexture ? new PIXI.Texture(x._baseTexture) : x;
        });
        for (let layer of this._layers) {
            let props = $gameMap.getLayerProperties(layer.layerId);
            let tilesetBitmaps = [];
            if(!props.tilesets) {
                continue;
            }
            props.tilesets.forEach(tilesetId => {
                tilesetBitmaps.push(bitmaps[tilesetId]);
            })
            layer.setBitmaps(tilesetBitmaps);
        }
    }

    update() {
        super.update();
        this._updateAnim();
    }

    _updateAnim() {
        let needRefresh = false;
        for (let key in this._animDuration) {
            this._animDuration[key] -= 1;
            if (this._animDuration[key] <= 0) {
                this._animFrame[key] += 1;
                needRefresh = true;
            }
        }

        if (needRefresh) {
            this.refresh();
        }
    }

    _updateLayerPositions(startX, startY) {
        let ox = 0;
        let oy = 0;
        if (this.roundPixels) {
            ox = Math.floor(this.origin.x);
            oy = Math.floor(this.origin.y);
        } else {
            ox = this.origin.x;
            oy = this.origin.y;
        }

        for (let layer of this._layers) {
            let layerData = this.tiledData.layers[layer.layerId];
            let offsetX = layerData.offsetx || 0;
            let offsetY = layerData.offsety || 0;
            layer.position.x = startX * this._tileWidth - ox + offsetX;
            layer.position.y = startY * this._tileHeight - oy + offsetY;
        }

        for (let sprite of this._priorityTiles) {
            let layerData = this.tiledData.layers[sprite.layerId];
            let offsetX = layerData ? layerData.offsetx || 0 : 0;
            let offsetY = layerData ? layerData.offsety || 0 : 0;
            sprite.x = sprite.origX + startX * this._tileWidth - ox + offsetX + sprite.width / 2;
            sprite.y = sprite.origY + startY * this._tileHeight - oy + offsetY + sprite.height;
        }
    }

    _paintAllTiles(startX, startY) {
        this._priorityTilesCount = 0;
        for (let layer of this._layers) {
            layer.clear();
            this._paintTiles(layer, startX, startY);
        }
        let id = 0;
        for (let layerData of this.tiledData.layers) {
            if (layerData.type != "objectgroup") {
                id++;
                continue;
            }
            this._paintObjectLayers(id, startX, startY);
            id++;
        }
        while (this._priorityTilesCount < this._priorityTiles.length) {
            let sprite = this._priorityTiles[this._priorityTilesCount];
            sprite.hide();
            sprite.layerId = -1;
            this._priorityTilesCount++;
        }
    }

    _paintTiles(layer, startX, startY) {
        let layerData = this.tiledData.layers[layer.layerId];

        if (!layerData.visible) {
            return;
        }

        if (layerData.type == "tilelayer") {
            this._paintTilesLayer(layer, startX, startY);
        }
    }

    _paintObjectLayers(layerId, startX, startY) {
        let layerData = this.tiledData.layers[layerId];
        let objects = layerData.objects || [];

        for (let obj of objects) {
            if (!obj.gid) {
                continue;
            }
            if (!obj.visible) {
                continue;
            }
            let tileId = obj.gid;
            let realTileId = tileId & 0x1FFFFFFF;
            let textureId = this._getTextureId(realTileId);
            let offsets = $gameMap.offsets();
            let dx = obj.x - (startX + offsets.x) * this._tileWidth;
            let dy = obj.y - (startY + offsets.y) * this._tileHeight - obj.height;
            let positionHeight = 0;
            let zIndex = false;
            if(obj.properties) {
                if(obj.properties.positionHeight) {
                    positionHeight = obj.properties.positionHeight;
                }
                if(obj.properties.hasOwnProperty('zIndex')) {
                    zIndex = obj.properties.zIndex;
                }
            }
            this._paintPriorityTile(layerId, textureId, tileId, startX, startY, dx, dy, positionHeight, zIndex);
        }
    }

    _paintTilesLayer(layer, startX, startY) {
        let tileCols = Math.ceil(this._width / this._tileWidth) + 1;
        let tileRows = Math.ceil(this._height / this._tileHeight) + 1;

        for (let y of Array(tileRows).keys()) {
            for (let x of Array(tileCols).keys()) {
                this._paintTile(layer, startX, startY, x, y);
            }
        }
    }

    _paintTile(layer, startX, startY, x, y) {
        let mx = x + startX;
        let my = y + startY;
        if (this.horizontalWrap) {
            mx = mx.mod(this._mapWidth);
        }
        if (this.verticalWrap) {
            my = my.mod(this._mapHeight);
        }
        let tilePosition = mx + my * this._mapWidth;
        let tileId = TiledManager.extractTileId(this.tiledData.layers[layer.layerId], tilePosition);
        let rectLayer = layer.children[0];
        let textureId = 0;
        let props = $gameMap.getLayerProperties(layer.layerId);

        if (!tileId) {
            return;
        }

        // TODO: Problem with offsets
        if (mx < 0 || mx >= this._mapWidth || my < 0 || my >= this._mapHeight) {
            return;
        }

        textureId = this._getTextureId(tileId);
        let tileset = this.tiledData.tilesets[textureId];
        let dx = x * this._tileWidth;
        let dy = y * this._tileHeight;
        let w = tileset.tilewidth;
        let h = tileset.tileheight;
        let tileCols = tileset.columns;
        let rId = this._getAnimTileId(textureId, tileId - tileset.firstgid);
        let ux = (rId % tileCols) * w;
        let uy = Math.floor(rId / tileCols) * h;

        if (this._isPriorityTile(layer.layerId)) {
            let positionHeight = 0;
            if(this.tiledData.layers[layer.layerId].properties.positionHeight) {
                positionHeight+= this.tiledData.layers[layer.layerId].properties.positionHeight || 0
            }
            if(tileset.tileproperties &&
                tileset.tileproperties[tileId - tileset.firstgid] &&
                tileset.tileproperties[tileId - tileset.firstgid].positionHeight) {
                positionHeight+= tileset.tileproperties[tileId - tileset.firstgid].positionHeight || 0
            }
            this._paintPriorityTile(layer.layerId, textureId, tileId, startX, startY, dx, dy, positionHeight);
            return;
        }

        if(props.tilesets && props.tilesets.indexOf(textureId) > -1) {
            textureId = props.tilesets.indexOf(textureId);
        }
        
        rectLayer.addRect(textureId, ux, uy, dx, dy, w, h);
    }

    _paintPriorityTile(layerId, textureId, tileId, startX, startY, dx, dy, positionHeight = 0, zIndex = false) {
        let tileset = this.tiledData.tilesets[textureId];
        let tileOrientation = (tileId >> 24) & 0xe0;
        let realTileId = tileId & 0x1FFFFFFF;
        var tile = tileset.tiles ? tileset.tiles[realTileId - tileset.firstgid] || {} : {};
        let w = tile.imagewidth || tileset.tilewidth;
        let h = tile.imageheight || tileset.tileheight;
        let tileCols = tileset.columns;
        let rId = this._getAnimTileId(textureId, realTileId - tileset.firstgid);
        let ux = (rId % tileCols) * w;
        let uy = Math.floor(rId / tileCols) * h;
        let sprite = this._priorityTiles[this._priorityTilesCount];
        let layerData = this.tiledData.layers[layerId];
        let offsetX = layerData ? layerData.offsetx || 0 : 0;
        let offsetY = layerData ? layerData.offsety || 0 : 0;
        let ox = 0;
        let oy = 0;
        let flipH = tileOrientation === 0x20 || ((tileOrientation & 0x80) > 0);
        let flipV = tileOrientation === 0x20 || ((tileOrientation & 0x40) > 0);
        if (this.roundPixels) {
            ox = Math.floor(this.origin.x);
            oy = Math.floor(this.origin.y);
        } else {
            ox = this.origin.x;
            oy = this.origin.y;
        }

        let size = parseInt(pluginParams["Priority Tiles Limit"]);
        if(this._priorityTilesCount >= this._priorityTiles.length) {
            if (size > 0) {
                return;
            } else {
                sprite = new Sprite_TiledPriorityTile();
                sprite.z = sprite.zIndex = parseInt(pluginParams["Z - Player"]);
                this.addChild(sprite);
                this._priorityTiles.push(sprite);
            }
        }

        sprite.layerId = layerId;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = (flipV ? 0.0 : 1.0);
        sprite.origX = dx;
        sprite.origY = dy;
        sprite.scale.x = (flipH ? -1 : 1);
        sprite.scale.y = (flipV ? -1 : 1);
        sprite.x = sprite.origX + startX * this._tileWidth - ox + offsetX + w / 2;
        sprite.y = sprite.origY + startY * this._tileHeight - oy + offsetY + h;
        
        let realTextureId = this._getTextureId(realTileId, true);
        if(Array.isArray(this.indexedBitmaps[realTextureId])) {
            var tile = tileset.tiles[realTileId - tileset.firstgid];
            sprite.bitmap = this.indexedBitmaps[realTextureId][realTileId - tileset.firstgid];
            sprite.setFrame(0, 0, tile.imagewidth, tile.imageheight);
        } else {
            sprite.bitmap = this.indexedBitmaps[realTextureId];
            sprite.setFrame(ux, uy, w, h);
        }
        sprite.priority = this._getPriority(layerId);
        sprite.z = sprite.zIndex = (zIndex !== false ? zIndex : this._getZIndex(layerId));
        sprite.positionHeight = positionHeight;
        sprite.show();

        this._priorityTilesCount += 1;
    }

    _getTextureId(tileId, ignore = false) {
        let textureId = 0;
        for (let tileset of this.tiledData.tilesets) {
            if (ignore && tileset.properties && tileset.properties.ignoreLoading) {
                continue;
            }
            if (tileId < tileset.firstgid
                || tileId >= tileset.firstgid + tileset.tilecount) {
                textureId++;
                continue;
            }
            break;
        }
        return textureId;
    }

    _getAnimTileId(textureId, tileId) {
        let tilesData = this.tiledData.tilesets[textureId].tiles;
        if (!tilesData) {
            return tileId;
        }
        if (!tilesData[tileId]) {
            return tileId;
        }
        if (!tilesData[tileId].animation) {
            return tileId;
        }
        let animation = tilesData[tileId].animation;
        this._animFrame[tileId] = this._animFrame[tileId] || 0;
        let frame = this._animFrame[tileId];
        this._animFrame[tileId] = !!animation[frame] ? frame : 0;
        frame = this._animFrame[tileId];
        let duration = animation[frame].duration / 1000 * 60;
        this._animDuration[tileId] = this._animDuration[tileId] || duration;
        if (this._animDuration[tileId] <= 0) {
            this._animDuration[tileId] = duration;
        }
        return animation[frame].tileid;
    }

    _getPriority(layerId) {
        let layerData = this.tiledData.layers[layerId];
        if (!layerData.properties) {
            return 0;
        }
        if (!layerData.properties.priority) {
            return 0;
        }
        return parseInt(layerData.properties.priority)
    }

    _isPriorityTile(layerId) {
        let playerZIndex = parseInt(pluginParams["Z - Player"]);
        let zIndex = this._getZIndex(layerId);
        return this._getPriority(layerId) > 0
            && zIndex === playerZIndex;
    }

    _getZIndex(layerId) {
        let layerData = this.tiledData.layers[layerId];
        if (!layerData) {
            return 0;
        }
        if (!layerData.properties || !layerData.properties.zIndex) {
            return 0;
        }
        return parseInt(layerData.properties.zIndex);
    }

    /**
     * Hides a layer based on the level the player is on
     * 
     * This method has been deprecated in favor of the more general method.
     */
    hideOnLevel(level) {
        let layerIds = [];
        for (let layer of this._layers) {
            let layerData = this.tiledData.layers[layer.layerId];
            if (layerData.properties && layerData.properties.hasOwnProperty("hideOnLevel")) {
                if (parseInt(layerData.properties.hideOnLevel) !== level) {
                    if(layer.transition) {
                        /* If this layer has a transition, we'll need to tell the layer that
                           it's supposed to be showing. */
                           layer.isShown = true;
                    }
                    this.addChild(layer);
                    continue;
                }
                /* Since the layer is supposed to be hidden, let's first let it transition if
                   it has a transition fadeout. */
                if(layer.transition) {
                    layer.isShown = false;
                    if(layer.minAlpha > 0 || layer.transitionStep > 0) {
                        this.addChild(layer)
                        continue;
                    }
                }
                /* Otherwise remove the layer and hide it */
                layerIds.push(layer.layerId);
                this.removeChild(layer);
            }
        }
        this._priorityTiles.forEach(sprite => {
            if(layerIds.indexOf(sprite.layerId) > -1) {
                sprite.visible = true;
            }
        })
    }
    
    /**
     * Hides layers on certain special conditions
     * 
     * This method will analyze each layer, then checks them with certain conditions. If
     * they meet one condition, they will be hidden.
     * 
     * It also handles fading in and out layers.
     */
    hideOnSpecial() {
        /* Iterates through each layer */
        for(let layer of this._layers) {
            let layerData = this.tiledData.layers[layer.layerId];
			if(layerData.properties) {
                let hideLayer = TiledManager.checkLayerHidden(layerData);
                
				/* If the layer has a hide property, run this code.
				 * You don't need to run it for layers that don't have any properties that would
				   hide this layer. */
				if (TiledManager.hasHideProperties(layerData)) {
					/* If the layer isn't supposed to be hidden, add the layer to the container */
                    let props = $gameMap.getLayerProperties(layer.layerId);
					if (!hideLayer) {
                        if(props.transition) {
                            /* If this layer has a transition, we'll need to tell the layer that
                               it's supposed to be showing. */
                               props.isShown = true;
                        }
						this.addChild(layer);
						continue;
                    }
                    /* Since the layer is supposed to be hidden, let's first let it transition if
                       it has a transition fadeout. */
                    if(props.transition) {
                        props.isShown = false;
                        if(props.minAlpha > 0 || props.transitionPhase > 0) {
                            this.addChild(layer)
                            continue;
                        }
                    }
                    /* Otherwise remove the layer and hide it */
					this.removeChild(layer);
				}
			}
        }
    }
	
    _compareChildOrder(a, b) {
        if((this._layers.indexOf(a) > -1 || this._imageLayers.indexOf(a) > -1) &&
            (this._layers.indexOf(b) > -1 || this._imageLayers.indexOf(b) > -1)) {
            if ((a.z || 0) !== (b.z || 0)) {
                return (a.z || 0) - (b.z || 0);
            } else if ((a.priority || 0) !== (b.priority || 0)) {
                return (a.priority || 0) - (b.priority || 0);
            } else if((a.layerId || 0) !== (b.layerId || 0)) {
                return (a.layerId || 0) - (b.layerId || 0);
            } else {
                return a.spriteId - b.spriteId;
            }
        } else if ((a.z || 0) !== (b.z || 0)) {
            return (a.z || 0) - (b.z || 0);
        } else if (((a.y || 0) + (a.positionHeight || 0)) !== ((b.y || 0) + (b.positionHeight || 0))) {
            return ((a.y || 0) + (a.positionHeight || 0)) - ((b.y || 0) + (b.positionHeight || 0));
        } else if ((a.priority || 0) !== (b.priority || 0)) {
            return (a.priority || 0) - (b.priority || 0);
        } else {
            return a.spriteId - b.spriteId;
        }
    }

    /* Parallax map stuff */

    _createImageLayer(layerData, id) {
        let zIndex = 0;
        let repeatX = false;
        let repeatY = false;
        let deltaX = 1;
        let deltaY = 1;
        let autoX = 0;
        let autoY = 0;
        let hue = 0;
		let viewportX = 0;
		let viewportY = 0;
		let viewportWidth = 0;
		let viewportHeight = 0;
		let viewportDeltaX = 0;
		let viewportDeltaY = 0;

        let props = $gameMap.getLayerProperties(id);

        if(!!layerData.properties) {
            if(!!layerData.properties.ignoreLoading) {
                return;
            }
            if (!!layerData.properties.zIndex) {
                zIndex = parseInt(layerData.properties.zIndex);
            }
            if(layerData.properties.hasOwnProperty('repeatX')) {
                repeatX = !!layerData.properties.repeatX;
            }
            if(layerData.properties.hasOwnProperty('repeatY')) {
                repeatY = !!layerData.properties.repeatY;
            }
            if(layerData.properties.hasOwnProperty('deltaX')) {
                deltaX = layerData.properties.deltaX;
            }
            if(layerData.properties.hasOwnProperty('deltaY')) {
                deltaY = layerData.properties.deltaY;
            }
            if(!!layerData.properties.autoX) {
                autoX = layerData.properties.autoX;
            }
            if(!!layerData.properties.autoY) {
                autoY = layerData.properties.autoY;
            }
            if(!!layerData.properties.hue) {
                hue = parseInt(layerData.properties.hue)
            }
			if(layerData.properties.hasOwnProperty('viewportX')) {
				viewportX = layerData.properties.viewportX;
			}
			if(layerData.properties.hasOwnProperty('viewportY')) {
				viewportY = layerData.properties.viewportY;
			}
			if(layerData.properties.hasOwnProperty('viewportWidth')) {
				viewportWidth = layerData.properties.viewportWidth;
			}
			if(layerData.properties.hasOwnProperty('viewportHeight')) {
				viewportHeight = layerData.properties.viewportHeight;
			}
			if(layerData.properties.hasOwnProperty('viewportDeltaX')) {
				viewportDeltaX = layerData.properties.viewportDeltaX;
			}
			if(layerData.properties.hasOwnProperty('viewportDeltaY')) {
				viewportDeltaY = layerData.properties.viewportDeltaY;
			}
        }

        let layer;

        if(!repeatX && !repeatY && !autoX && !autoY) {
            layer = new Sprite_Base();
        } else {
            layer = new TilingSprite();
            layer.move(0, 0, Graphics.width, Graphics.height);
        }
        layer.layerId = id;
        layer.spriteId = Sprite._counter++;
        layer.alpha = layerData.opacity;
        layer.bitmap = ImageManager.loadParserParallax(layerData.image, hue);
        layer.bitmap.addLoadListener(() => {
            props.imageWidth = layer.bitmap.width;
            props.imageHeight = layer.bitmap.height;
        })
        layer.baseX = layerData.x + (layerData.offsetx || 0);
        layer.baseY = layerData.y + (layerData.offsety || 0);
        layer.z = layer.zIndex = zIndex;
        layer.repeatX = repeatX;
        layer.repeatY = repeatY;
        layer.deltaX = deltaX;
        layer.deltaY = deltaY;
        layer.stepAutoX = autoX;
        layer.stepAutoY = autoY;
        layer.autoX = 0;
        layer.autoY = 0;
		if(viewportWidth || viewportHeight) {
			viewportWidth = viewportWidth || Graphics.width;
			viewportHeight = viewportHeight || Graphics.height;
			let layerMask = new PIXI.Graphics();
			layerMask.baseX = viewportX;
			layerMask.baseY = viewportY;
			layerMask.baseWidth = viewportWidth;
			layerMask.baseHeight = viewportHeight;
			layerMask.deltaX = viewportDeltaX;
			layerMask.deltaY = viewportDeltaY;
			layer.mask = layerMask;
			layer.hasViewport = true;
		}
        this._imageLayers.push(layer);
        this.addChild(layer);
    }

    updateImageLayer() {
        this._imageLayers.forEach(layer => {
            let layerData = this.tiledData.layers[layer.layerId];
            let props = $gameMap.getLayerProperties(layer.layerId);
            if(TiledManager.hasHideProperties(layerData)) {
                let visibility = TiledManager.checkLayerHidden(layerData);
                if(props.transition) {
                    layer.alpha = (((props.baseAlpha - props.minAlpha) * (props.transitionPhase / props.transition)) + props.minAlpha);
                    visibility = props.minAlpha > 0 || props.transitionPhase > 0;
                }
                layer.visible = visibility;
            }
			let offsets = $gameMap.offsets();
			offsets.x*= $gameMap.tileWidth();
            offsets.y*= $gameMap.tileHeight();
            let display = {
                x: $gameMap.displayX() * $gameMap.tileWidth() - offsets.x,
                y: $gameMap.displayY() * $gameMap.tileHeight() - offsets.y
            }
            if(!!layer.origin) {
                let autoX = props.autoXFunction ? props.autoXFunction(props.autoX, props.autoY || 0) : 0;
                let autoY = props.autoYFunction ? props.autoYFunction(props.autoX || 0, props.autoY) : 0;
                if(!layer.repeatX) {
                    layer.origin.x = layer.baseX - offsets.x + autoX;
                    layer.x = layer.baseX - offsets.x - display.x * layer.deltaX;
                    layer.width = layer.bitmap.width;
                } else {
                    layer.origin.x = layer.baseX - offsets.x + autoX + display.x * layer.deltaX;
                    layer.x = 0;
                    layer.width = Graphics.width;
                }
                if(!layer.repeatY) {
                    layer.origin.y = layer.baseY - offsets.y + autoY;
                    layer.y = layer.baseY - offsets.y - display.y * layer.deltaY;
                    layer.height = layer.bitmap.height;
                } else {
                    layer.origin.y = layer.baseY - offsets.y + autoY + display.y * layer.deltaY;
                    layer.y = 0;
                    layer.height = Graphics.height;
                }
            } else {
                layer.x = layer.baseX - offsets.x - display.x * layer.deltaX;
                layer.y = layer.baseY - offsets.y - display.y * layer.deltaY;
            }
			if(layer.hasViewport) {
				let viewportX = layer.mask.baseX - offsets.x - display.x * layer.mask.deltaX;
				let viewportY = layer.mask.baseY - offsets.y - display.y * layer.mask.deltaY;
				layer.mask.clear();
				layer.mask.beginFill(0xffffff, 1);
				layer.mask.drawRect(viewportX, viewportY, layer.mask.baseWidth, layer.mask.baseHeight);
			}
        })
    }
}