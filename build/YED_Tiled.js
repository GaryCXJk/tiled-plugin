/*:
 * @plugindesc v1.10 Plugin supports Tiled Map Editor maps with some additional
 * features.
 * @author Dr.Yami
 *
 * @param Maps Location
 * @desc The folder where maps are located.
 * Default: maps/
 * @default maps/
 *
 * @param Tilesets Location
 * @desc The folder where tilesets are located.
 * Default: tilesets/
 * @default tilesets/
 *
 * @param Z - Player
 * @desc Z Index for Same as Characters events and Players.
 * Default: 3
 * @default 3
 *
 * @param Z - Below Player
 * @desc Z Index for Below Characters events.
 * Default: 1
 * @default 1
 *
 * @param Z - Above Player
 * @desc Z Index for Above Characters events.
 * Default: 5
 * @default 5
 *
 * @param Half-tile movement
 * @desc Moving and collision checking by half a tile.
 * Can be true or false
 * @default true
 * @type boolean
 *
 * @param Priority Tiles Limit
 * @desc Limit for priority tile sprites.
 * Should not be too large.
 * @default 256
 *
 * @param Map Level Variable
 * @desc Get and set map level by variable
 * @default 0
 * 
 * @param Position Height - Always Check On Move Update
 * @desc Whether the position height should update on every move tick or just the final
 * @default false
 * @type boolean
 *
 * @help
 * Use these properties in Tiled Map's layer:
 *   zIndex
 *   The layer will have z-index == property's value
 *
 *   collision
 *   The layer will be collision mask layer. Use one of these value:
 *     full - Normal collision (1 full-tile)
 *     arrow - Arrow collision
 *     up-left - Half-tile collision up-left quarter
 *     up-right - Half-tile collision up-right quarter
 *     down-left - Half-tile collision down-left quarter
 *     down-right - Half-tile collision down-right quarter
 *     tiles - Collision is determined by the tileset
 *
 *   arrowImpassable
 *   If the layer is an arraw collision mask layer, it will make one direction be impassable
 *   Value can be up, down, left, right
 *
 *   regionId
 *   Mark the layer as region layer, the layer ID will be the value of property. If set to
 *   -1, it will use the tileset to determine the region ID.
 *
 *   hideOnRegion
 *   Hide the layer when on a certain region.
 *
 *   hideOnRegions
 *   Hide the layer when on a certain region. This takes an array of possible regions, and
 *   the player only needs to be on one of the layers. Each region is comma separated.
 * 
 *   hideOnAnyRegions
 *   Hide the layer when on a certain region. This functions the same as hideOnRegions,
 *   except it will take all regions on that tile instead of just the top visible region.
 *
 *   priority
 *   Mark the layer as priority layer, allows it goes above player when player is behind,
 *   below player when player is in front of. Value should be > 0, zIndex should be
 *   the same as player z-index.
 *
 *   level
 *   Mark the layer on different level, use for multiple levels map (for example a bridge).
 *   Default level is 0. Use this for collision and regionId.
 *
 *   hideOnLevel
 *   Hide the layer when on a certain level.
 *
 *   toLevel
 *   The tiles on this layer will transfer player to another level.
 *
 *   hideOnSwitch
 *   Hide the layer when a certain switch is set.
 *
 *   showOnSwitch
 *   Show the layer when a certain switch is set.
 * 
 *   tileFlags
 *   Set this to true to enable tile flags in the tileset. Set this to hide if you aren't
 *   going to draw this layer.
 *
 * Use these properties in Tiled Tileset's tile:
 *   regionId
 *   Mark the tile as region, the tile's region ID will be the value of property
 *
 *   collision
 *   Mark the tile as having normal collision (1 full-tile)
 *
 *   collisionUpLeft
 *   Mark the tile as having half-tile collision up-left quarter
 *
 *   collisionUpRight
 *   Mark the tile as having half-tile collision up-right quarter
 *
 *   collisionDownLeft
 *   Mark the tile as having half-tile collision down-left quarter
 *
 *   collisionDownRight
 *   Mark the tile as having half-tile collision down-right quarter
 *
 *   collisionUpLeft, collisionUpRight, collisionDownLeft and collisionDownRight can be
 *   combined to create a custom collision.
 *
 *   arrowImpassableLeft
 *   Make the left direction impassable
 *
 *   arrowImpassableUp
 *   Make the up direction impassable
 *
 *   arrowImpassableRight
 *   Make the right direction impassable
 *
 *   arrowImpassableDown
 *   Make the down direction impassable
 *
 *   arrowImpassableLeft, arrowImpassableUp, arrowImpassableRight and arrowImpassableDown
 *   can be combined to create a custom arrow passability.
 * 
 *   flagIsLadder
 *   The tile is a ladder
 *   
 *   flagIsBush
 *   The tile is a bush or has special bush rendering
 * 
 *   flagIsCounter
 *   The tile is a counter (can interact through this tile with another event)
 * 
 *   flagIsDamage
 *   The tile is a damage tile (player gets damaged when stepped on)
 * 
 *   flagIsIce
 *   The tile is slippery (not implemented, reserved)
 * 
 *   flagIsBoat
 *   The tile is passable by boat
 * 
 *   flagIsShip
 *   The tile is passable by ship
 * 
 *   flagIsAirship
 *   The tile is landable by airship
 * 
 * =========================================================================================
 *   For plugin developers
 *     - Extra notes by Gary Kertopermono a.k.a. GaryCXJk
 * =========================================================================================
 * 
 * There are now hooks for plugin developers, so that they could add their own plugin hooks.
 * 
 * Static methods:
 * 
 *   TiledManager.addHideFunction(id, callback[, ignore])
 * 
 *     Adds a new function to hide or even show certain layers based on conditions.
 * 
 *     id
 *     An identifier. This is also the name of the property that you'll define on the layer.
 * 
 *     callback
 *     A function that gets called whenever a layer needs to be checked whether or not it's
 *     hidden. It requires the layer data as an argument and returns  whether to hide the
 *     layer or not, where true means the layer will be hidden.
 * 
 *     ignore (optional)
 *     An array that defines which types of data will ignore this hide function. Possible
 *     types are:
 *     collisionMap, arrowCollisionMap, regions, mapLevelChange, tileFlags
 * 
 *       Example:
 * 
 *       TiledManager.addHideFunction("randomlyHide", function(layerData) {
 *         return Math.floor(Math.random() * 2) === 1;
 *       });
 * 
 *   TiledManager.addFlag(flagId)
 * 
 *     Adds a new flag. This can be handy if you want to add in new flags that currently
 *     are not in the game, for example, if you want to add a special flag to see whether
 *     you could swim in this tile. Note that collision still takes priority over these
 *     flags, however, it is now possible to have an area both be walkable and be passable
 *     by boat or ship, since vehicles now make use of these flags.
 * 
 *     flagId
 *     The ID of a flag as a string.
 * 
 *   TiledManager.getFlag(flagId)
 * 
 *     Gets the numerical index of the flag added by TiledManager.addFlag, including the
 *     existing flags (boat, ship, airship, ladder, bush, counter, damage, ice).
 * 
 *     flagId
 *     The ID of a flag as a string.
 * 
 *   TiledManager.getFlagLocation(flagId)
 * 
 *     Gets the location of the flag in the tile data. It returns an array with two
 *     integers, the group and the bit flag. The group is essentially the array index,
 *     since the tile flags are stored in an array of 16-bit values.
 * 
 *     flagId
 *     The ID of a flag as a string.
 * 
 * Instance methods:
 * 
 *   $gameMap.regionIds(x, y)
 * 
 *     Gets all region IDs at the current location.
 * 
 *     x
 *     The x-coordinate
 * 
 *     y
 *     The y-coordinate
 * 
 *   $gameMap.renderPassage(x, y, bit[, render[, level]])
 * 
 *     Gets the passage data for the given coordinates on a certain layer ID. If
 *     the layer ID is static (does not hide or show with certain conditions),
 *     then it defaults back to the main layer. This method is primarily created
 *     for plugins that pre-render the collision data.
 * 
 *     x
 *     The x-coordinate
 * 
 *     y
 *     The y-coordinate
 * 
 *     bit
 *     The bit flags it needs to check on
 *     This has been simplified to down (0x01), left (0x02), right (0x04) and up
 *     (0x08).
 * 
 *     render (optional, default: 'main')
 *     The layer it needs to render
 * 
 *     level (optional, default: 0)
 *     The level the layer is on
 * 
 *   $gameMap.getPassageLayers(level)
 * 
 *     Gets all layers that have their own passage data (collision arrows).
 * 
 *     level
 *     The level the layers need to be taken from
 * 
 *   $gameMap.renderIsPassable(x, y, d[, render[, level]])
 * 
 *     Gets the collision data for the given coordinates on a certain layer ID. If
 *     the layer ID is static (does not hide or show with certain conditions),
 *     then it defaults back to the main layer. This method is primarily created
 *     for plugins that pre-render the collision data.
 * 
 *     x
 *     The x-coordinate
 * 
 *     y
 *     The y-coordinate
 * 
 *     d
 *     The direction (down: 2, left: 4, right: 6, up: 8)
 * 
 *     render (optional, default: 'main')
 *     The layer it needs to render
 * 
 *     level (optional, default: 0)
 *     The level the layer is on
 * 
 *   $gameMap.getIsPassableLayers(level)
 * 
 *     Gets all layers that have their own collision data. This also includes the
 *     arrow collision data.
 * 
 *     level
 *     The level the layers need to be taken from
 * 
 */

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TiledTilemap = exports.TiledTilemap = function (_ShaderTilemap) {
    _inherits(TiledTilemap, _ShaderTilemap);

    function TiledTilemap() {
        _classCallCheck(this, TiledTilemap);

        return _possibleConstructorReturn(this, (TiledTilemap.__proto__ || Object.getPrototypeOf(TiledTilemap)).apply(this, arguments));
    }

    _createClass(TiledTilemap, [{
        key: 'initialize',
        value: function initialize(tiledData) {
            this._tiledData = {};
            this._layers = [];
            this._priorityTiles = [];
            this._priorityTilesCount = 0;
            this.tiledData = tiledData;
            _get(TiledTilemap.prototype.__proto__ || Object.getPrototypeOf(TiledTilemap.prototype), 'initialize', this).call(this);
            this.setupTiled();
        }
    }, {
        key: 'setupTiled',
        value: function setupTiled() {
            this._setupSize();
            this._setupAnim();
        }
    }, {
        key: '_setupSize',
        value: function _setupSize() {
            var width = this._width;
            var height = this._height;
            var margin = this._margin;
            var tileCols = Math.ceil(width / this._tileWidth) + 1;
            var tileRows = Math.ceil(height / this._tileHeight) + 1;
            this._tileWidth = this.tiledData.tilewidth;
            this._tileHeight = this.tiledData.tileheight;
            this._layerWidth = tileCols * this._tileWidth;
            this._layerHeight = tileRows * this._tileHeight;
            this._mapWidth = this.tiledData.width;
            this._mapHeight = this.tiledData.height;
        }
    }, {
        key: '_setupAnim',
        value: function _setupAnim() {
            this._animFrame = {};
            this._animDuration = {};
        }
    }, {
        key: '_createLayers',
        value: function _createLayers() {
            var id = 0;
            this._needsRepaint = true;

            var parameters = PluginManager.parameters('ShaderTilemap');
            var useSquareShader = Number(parameters.hasOwnProperty('squareShader') ? parameters['squareShader'] : 1);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.tiledData.layers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var layerData = _step.value;

                    var zIndex = 0;
                    if (layerData.type != "tilelayer") {
                        id++;
                        continue;
                    }

                    if (!!layerData.properties && !!layerData.properties.zIndex) {
                        zIndex = parseInt(layerData.properties.zIndex);
                    }

                    if (!!layerData.properties && !!layerData.properties.collision) {
                        id++;
                        continue;
                    }

                    if (!!layerData.properties && !!layerData.properties.toLevel) {
                        id++;
                        continue;
                    }

                    if (!!layerData.properties && !!layerData.properties.regionId) {
                        id++;
                        continue;
                    }

                    if (!!layerData.properties && layerData.properties.tileFlags === 'hide') {
                        id++;
                        continue;
                    }

                    var layer = new PIXI.tilemap.CompositeRectTileLayer(zIndex, [], useSquareShader);
                    layer.layerId = id; // @dryami: hack layer index
                    layer.spriteId = Sprite._counter++;
                    this._layers.push(layer);
                    this.addChild(layer);
                    id++;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this._createPriorityTiles();
        }
    }, {
        key: '_createPriorityTiles',
        value: function _createPriorityTiles() {
            var pluginParams = PluginManager.parameters("YED_Tiled");
            var size = parseInt(pluginParams["Priority Tiles Limit"]);
            var zIndex = parseInt(pluginParams["Z - Player"]);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Array(size).keys()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var x = _step2.value;

                    var sprite = new Sprite_TiledPriorityTile();
                    sprite.z = sprite.zIndex = zIndex;
                    sprite.layerId = -1;
                    sprite.hide();
                    this.addChild(sprite);
                    this._priorityTiles.push(sprite);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: '_hackRenderer',
        value: function _hackRenderer(renderer) {
            return renderer;
        }
    }, {
        key: 'refreshTileset',
        value: function refreshTileset() {
            var bitmaps = this.bitmaps.map(function (x) {
                return x._baseTexture ? new PIXI.Texture(x._baseTexture) : x;
            });
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this._layers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var layer = _step3.value;

                    layer.setBitmaps(bitmaps);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    }, {
        key: 'update',
        value: function update() {
            _get(TiledTilemap.prototype.__proto__ || Object.getPrototypeOf(TiledTilemap.prototype), 'update', this).call(this);
            this._updateAnim();
        }
    }, {
        key: '_updateAnim',
        value: function _updateAnim() {
            var needRefresh = false;
            for (var key in this._animDuration) {
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
    }, {
        key: '_updateLayerPositions',
        value: function _updateLayerPositions(startX, startY) {
            var ox = 0;
            var oy = 0;
            if (this.roundPixels) {
                ox = Math.floor(this.origin.x);
                oy = Math.floor(this.origin.y);
            } else {
                ox = this.origin.x;
                oy = this.origin.y;
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this._layers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var layer = _step4.value;

                    var layerData = this.tiledData.layers[layer.layerId];
                    var offsetX = layerData.offsetx || 0;
                    var offsetY = layerData.offsety || 0;
                    layer.position.x = startX * this._tileWidth - ox + offsetX;
                    layer.position.y = startY * this._tileHeight - oy + offsetY;
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this._priorityTiles[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var sprite = _step5.value;

                    var layerData = this.tiledData.layers[sprite.layerId];
                    var offsetX = layerData ? layerData.offsetx || 0 : 0;
                    var offsetY = layerData ? layerData.offsety || 0 : 0;
                    sprite.x = sprite.origX + startX * this._tileWidth - ox + offsetX + sprite.width / 2;
                    sprite.y = sprite.origY + startY * this._tileHeight - oy + offsetY + sprite.height;
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }
        }
    }, {
        key: '_paintAllTiles',
        value: function _paintAllTiles(startX, startY) {
            this._priorityTilesCount = 0;
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this._layers[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var layer = _step6.value;

                    layer.clear();
                    this._paintTiles(layer, startX, startY);
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            var id = 0;
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = this.tiledData.layers[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var layerData = _step7.value;

                    if (layerData.type != "objectgroup") {
                        id++;
                        continue;
                    }
                    this._paintObjectLayers(id, startX, startY);
                    id++;
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            while (this._priorityTilesCount < this._priorityTiles.length) {
                var sprite = this._priorityTiles[this._priorityTilesCount];
                sprite.hide();
                sprite.layerId = -1;
                this._priorityTilesCount++;
            }
        }
    }, {
        key: '_paintTiles',
        value: function _paintTiles(layer, startX, startY) {
            var layerData = this.tiledData.layers[layer.layerId];

            if (!layerData.visible) {
                return;
            }

            if (layerData.type == "tilelayer") {
                this._paintTilesLayer(layer, startX, startY);
            }
        }
    }, {
        key: '_paintObjectLayers',
        value: function _paintObjectLayers(layerId, startX, startY) {
            var layerData = this.tiledData.layers[layerId];
            var objects = layerData.objects || [];

            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = objects[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var obj = _step8.value;

                    if (!obj.gid) {
                        continue;
                    }
                    if (!obj.visible) {
                        continue;
                    }
                    var tileId = obj.gid;
                    var textureId = this._getTextureId(tileId);
                    var dx = obj.x - startX * this._tileWidth;
                    var dy = obj.y - startY * this._tileHeight - obj.height;
                    this._paintPriorityTile(layerId, textureId, tileId, startX, startY, dx, dy);
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }
        }
    }, {
        key: '_paintTilesLayer',
        value: function _paintTilesLayer(layer, startX, startY) {
            var tileCols = Math.ceil(this._width / this._tileWidth) + 1;
            var tileRows = Math.ceil(this._height / this._tileHeight) + 1;

            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = Array(tileRows).keys()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var y = _step9.value;
                    var _iteratorNormalCompletion10 = true;
                    var _didIteratorError10 = false;
                    var _iteratorError10 = undefined;

                    try {
                        for (var _iterator10 = Array(tileCols).keys()[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                            var x = _step10.value;

                            this._paintTile(layer, startX, startY, x, y);
                        }
                    } catch (err) {
                        _didIteratorError10 = true;
                        _iteratorError10 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion10 && _iterator10.return) {
                                _iterator10.return();
                            }
                        } finally {
                            if (_didIteratorError10) {
                                throw _iteratorError10;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                        _iterator9.return();
                    }
                } finally {
                    if (_didIteratorError9) {
                        throw _iteratorError9;
                    }
                }
            }
        }
    }, {
        key: '_paintTile',
        value: function _paintTile(layer, startX, startY, x, y) {
            var mx = x + startX;
            var my = y + startY;
            if (this.horizontalWrap) {
                mx = mx.mod(this._mapWidth);
            }
            if (this.verticalWrap) {
                my = my.mod(this._mapHeight);
            }
            var tilePosition = mx + my * this._mapWidth;
            var tileId = this.tiledData.layers[layer.layerId].data[tilePosition];
            var rectLayer = layer.children[0];
            var textureId = 0;

            if (!tileId) {
                return;
            }

            // TODO: Problem with offsets
            if (mx < 0 || mx >= this._mapWidth || my < 0 || my >= this._mapHeight) {
                return;
            }

            textureId = this._getTextureId(tileId);

            var tileset = this.tiledData.tilesets[textureId];
            var dx = x * this._tileWidth;
            var dy = y * this._tileHeight;
            var w = tileset.tilewidth;
            var h = tileset.tileheight;
            var tileCols = tileset.columns;
            var rId = this._getAnimTileId(textureId, tileId - tileset.firstgid);
            var ux = rId % tileCols * w;
            var uy = Math.floor(rId / tileCols) * h;

            if (this._isPriorityTile(layer.layerId)) {
                var positionHeight = 0;
                if (this.tiledData.layers[layer.layerId].properties.positionHeight) {
                    positionHeight += this.tiledData.layers[layer.layerId].properties.positionHeight || 0;
                }
                if (tileset.tileproperties && tileset.tileproperties[tileId - tileset.firstgid] && tileset.tileproperties[tileId - tileset.firstgid].positionHeight) {
                    positionHeight += tileset.tileproperties[tileId - tileset.firstgid].positionHeight || 0;
                }
                this._paintPriorityTile(layer.layerId, textureId, tileId, startX, startY, dx, dy, positionHeight);
                return;
            }

            rectLayer.addRect(textureId, ux, uy, dx, dy, w, h);
        }
    }, {
        key: '_paintPriorityTile',
        value: function _paintPriorityTile(layerId, textureId, tileId, startX, startY, dx, dy) {
            var positionHeight = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;

            var tileset = this.tiledData.tilesets[textureId];
            var w = tileset.tilewidth;
            var h = tileset.tileheight;
            var tileCols = tileset.columns;
            var rId = this._getAnimTileId(textureId, tileId - tileset.firstgid);
            var ux = rId % tileCols * w;
            var uy = Math.floor(rId / tileCols) * h;
            var sprite = this._priorityTiles[this._priorityTilesCount];
            var layerData = this.tiledData.layers[layerId];
            var offsetX = layerData ? layerData.offsetx || 0 : 0;
            var offsetY = layerData ? layerData.offsety || 0 : 0;
            var ox = 0;
            var oy = 0;
            if (this.roundPixels) {
                ox = Math.floor(this.origin.x);
                oy = Math.floor(this.origin.y);
            } else {
                ox = this.origin.x;
                oy = this.origin.y;
            }

            if (this._priorityTilesCount >= this._priorityTiles.length) {
                return;
            }

            sprite.layerId = layerId;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 1.0;
            sprite.origX = dx;
            sprite.origY = dy;
            sprite.x = sprite.origX + startX * this._tileWidth - ox + offsetX + w / 2;
            sprite.y = sprite.origY + startY * this._tileHeight - oy + offsetY + h;
            sprite.bitmap = this.bitmaps[textureId];
            sprite.setFrame(ux, uy, w, h);
            sprite.priority = this._getPriority(layerId);
            sprite.z = sprite.zIndex = this._getZIndex(layerId);
            sprite.positionHeight = positionHeight;
            sprite.show();

            this._priorityTilesCount += 1;
        }
    }, {
        key: '_getTextureId',
        value: function _getTextureId(tileId) {
            var textureId = 0;
            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
                for (var _iterator11 = this.tiledData.tilesets[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                    var tileset = _step11.value;

                    if (tileId < tileset.firstgid || tileId >= tileset.firstgid + tileset.tilecount) {
                        textureId++;
                        continue;
                    }
                    break;
                }
            } catch (err) {
                _didIteratorError11 = true;
                _iteratorError11 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion11 && _iterator11.return) {
                        _iterator11.return();
                    }
                } finally {
                    if (_didIteratorError11) {
                        throw _iteratorError11;
                    }
                }
            }

            return textureId;
        }
    }, {
        key: '_getAnimTileId',
        value: function _getAnimTileId(textureId, tileId) {
            var tilesData = this.tiledData.tilesets[textureId].tiles;
            if (!tilesData) {
                return tileId;
            }
            if (!tilesData[tileId]) {
                return tileId;
            }
            if (!tilesData[tileId].animation) {
                return tileId;
            }
            var animation = tilesData[tileId].animation;
            this._animFrame[tileId] = this._animFrame[tileId] || 0;
            var frame = this._animFrame[tileId];
            this._animFrame[tileId] = !!animation[frame] ? frame : 0;
            frame = this._animFrame[tileId];
            var duration = animation[frame].duration / 1000 * 60;
            this._animDuration[tileId] = this._animDuration[tileId] || duration;
            if (this._animDuration[tileId] <= 0) {
                this._animDuration[tileId] = duration;
            }
            return animation[frame].tileid;
        }
    }, {
        key: '_getPriority',
        value: function _getPriority(layerId) {
            var layerData = this.tiledData.layers[layerId];
            if (!layerData.properties) {
                return 0;
            }
            if (!layerData.properties.priority) {
                return 0;
            }
            return parseInt(layerData.properties.priority);
        }
    }, {
        key: '_isPriorityTile',
        value: function _isPriorityTile(layerId) {
            var pluginParams = PluginManager.parameters("YED_Tiled");
            var playerZIndex = parseInt(pluginParams["Z - Player"]);
            var zIndex = this._getZIndex(layerId);
            return this._getPriority(layerId) > 0 && zIndex === playerZIndex;
        }
    }, {
        key: '_getZIndex',
        value: function _getZIndex(layerId) {
            var layerData = this.tiledData.layers[layerId];
            if (!layerData) {
                return 0;
            }
            if (!layerData.properties || !layerData.properties.zIndex) {
                return 0;
            }
            return parseInt(layerData.properties.zIndex);
        }
    }, {
        key: 'hideOnLevel',
        value: function hideOnLevel(level) {
            var layerIds = [];
            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                for (var _iterator12 = this._layers[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var layer = _step12.value;

                    var layerData = this.tiledData.layers[layer.layerId];
                    if (layerData.properties && layerData.properties.hasOwnProperty("hideOnLevel")) {
                        if (parseInt(layerData.properties.hideOnLevel) !== level) {
                            this.addChild(layer);
                            continue;
                        }
                        layerIds.push(layer.layerId);
                        this.removeChild(layer);
                    }
                }
            } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion12 && _iterator12.return) {
                        _iterator12.return();
                    }
                } finally {
                    if (_didIteratorError12) {
                        throw _iteratorError12;
                    }
                }
            }

            this._priorityTiles.forEach(function (sprite) {
                if (layerIds.indexOf(sprite.layerId) > -1) {
                    sprite.visible = true;
                }
            });
        }
    }, {
        key: 'hideOnSpecial',
        value: function hideOnSpecial() {
            var _iteratorNormalCompletion13 = true;
            var _didIteratorError13 = false;
            var _iteratorError13 = undefined;

            try {
                for (var _iterator13 = this._layers[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                    var layer = _step13.value;

                    var layerData = this.tiledData.layers[layer.layerId];
                    if (layerData.properties) {
                        var hiddenData = TiledManager.checkLayerHidden(layerData);
                        var hasHideProperties = hiddenData[0];
                        var hideLayer = hiddenData[1];

                        /* If the layer has a hide property, run this code.
                         * You don't need to run it for layers that don't have any properties that would
                           hide this layer. */
                        if (hasHideProperties) {
                            /* If the layer isn't supposed to be hidden, add the layer to the container */
                            if (!hideLayer) {
                                this.addChild(layer);
                                continue;
                            }
                            /* Otherwise remove the layer and hide it */
                            this.removeChild(layer);
                        }
                    }
                }
            } catch (err) {
                _didIteratorError13 = true;
                _iteratorError13 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion13 && _iterator13.return) {
                        _iterator13.return();
                    }
                } finally {
                    if (_didIteratorError13) {
                        throw _iteratorError13;
                    }
                }
            }
        }
    }, {
        key: '_compareChildOrder',
        value: function _compareChildOrder(a, b) {
            if ((a.z || 0) !== (b.z || 0)) {
                return (a.z || 0) - (b.z || 0);
            } else if ((a.y || 0) + (a.positionHeight || 0) !== (b.y || 0) + (b.positionHeight || 0)) {
                return (a.y || 0) + (a.positionHeight || 0) - ((b.y || 0) + (b.positionHeight || 0));
            } else if ((a.priority || 0) !== (b.priority || 0)) {
                return (a.priority || 0) - (b.priority || 0);
            } else {
                return a.spriteId - b.spriteId;
            }
        }
    }, {
        key: 'tiledData',
        get: function get() {
            return this._tiledData;
        },
        set: function set(val) {
            this._tiledData = val;
            this.setupTiled();
        }
    }]);

    return TiledTilemap;
}(ShaderTilemap);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(2);

__webpack_require__(3);

__webpack_require__(4);

__webpack_require__(5);

__webpack_require__(11);

var _TiledTilemap = __webpack_require__(0);

__webpack_require__(6);

__webpack_require__(7);

__webpack_require__(8);

__webpack_require__(9);

__webpack_require__(10);

/* INITIALIZES LISTENERS */

// Add floor damage while on a slippery floor
TiledManager.addListener(Game_Player, 'slipperyfloor', function (options) {
    var d = options.d;

    $gameParty.members().forEach(function (actor) {
        actor.checkFloorEffect();
    });
    this.moveStraight(d);
});

/* INITIALIZES HIDE FUNCTIONS */

TiledManager.addHideFunction('hideOnRegion', function (layerData) {
    /* Hide if player is on certain region */
    var regionId = $gameMap.regionId($gamePlayer.x, $gamePlayer.y);
    var hideLayer = false;
    if (parseInt(layerData.properties.hideOnRegion) === regionId) {
        hideLayer = true;
    }
    return hideLayer;
}, ['regions']);

TiledManager.addHideFunction('hideOnRegions', function (layerData) {
    /* Hide if player is on certain region */
    var regionId = $gameMap.regionId($gamePlayer.x, $gamePlayer.y);
    var hideLayer = false;
    if (layerData.properties.hideOnRegions.split(',').indexOf(String(regionId)) !== -1) {
        hideLayer = true;
    }
    return hideLayer;
}, ['regions']);

TiledManager.addHideFunction('hideOnAnyRegions', function (layerData) {
    /* Hide if player is on certain region */
    var regionIds = $gameMap.regionIds($gamePlayer.x, $gamePlayer.y);
    var hideLayer = false;
    var regions = layerData.properties.hideOnRegions.split(',');
    if (regions.filter(function (region) {
        return regionIds.indexOf(region) > -1;
    }).length > 0) {
        hideLayer = true;
    }
    return hideLayer;
}, ['regions']);

TiledManager.addHideFunction('hideOnSwitch', function (layerData) {
    /* Hide if switch is on */
    var hideLayer = false;
    if ($gameSwitches.value(layerData.properties.hideOnSwitch)) {
        hideLayer = true;
    }
    return hideLayer;
});

TiledManager.addHideFunction('showOnSwitch', function (layerData) {
    /* Show if switch is on */
    var hideLayer = false;
    if (!$gameSwitches.value(layerData.properties.hideOnSwitch)) {
        hideLayer = true;
    }
    return hideLayer;
});

/* INITIALIZES FLAGS */

TiledManager.addFlag('boat', 'ship', 'airship');
TiledManager.addFlag('ladder', 'bush', 'counter', 'damage');
TiledManager.addFlag('ice', 'autoDown', 'autoLeft', 'autoRight', 'autoUp');

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//-----------------------------------------------------------------------------
// TilesetManager
//
// The static class that manages the TileD tilesets.

function TilesetManager() {
    throw new Error('This is a static class');
}

window.TilesetManager = TilesetManager;
TilesetManager.tilesets = {};

var _getFilename = function _getFilename(path) {
    var paths = path.split("/");
    return paths[paths.length - 1];
};

var _getRealPath = function _getRealPath(path) {
    var pluginParams = PluginManager.parameters("YED_Tiled");
    return pluginParams["Tilesets Location"] + _getFilename(path);
};

TilesetManager.getTileset = function (path) {
    var realPath = _getRealPath(path);
    return TilesetManager.tilesets[_getFilename(path)];
};

TilesetManager.loadTileset = function (path) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var realPath = _getRealPath(path);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './' + realPath);
    xhr.overrideMimeType('application/json');

    // on success callback
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var tileset = false;
            if (xhr.status === 200 || xhr.responseText !== "") {
                tileset = JSON.parse(xhr.responseText);
                TilesetManager.tilesets[_getFilename(path)] = tileset;
            }
            if (callback) {
                callback(tileset);
            }
        }
    };

    // send request
    xhr.send();
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


DataManager._tempTiledData = null;
DataManager._tiledLoaded = false;

var _loadMapData = DataManager.loadMapData;
DataManager.loadMapData = function (mapId) {
    _loadMapData.call(this, mapId);
    if (mapId > 0) {
        this.loadTiledMapData(mapId);
    } else {
        this.unloadTiledMapData();
    }
};

DataManager.loadTiledMapData = function (mapId) {
    var xhr = new XMLHttpRequest();
    var pluginParams = PluginManager.parameters("YED_Tiled");
    xhr.open('GET', "./" + pluginParams["Maps Location"] + "Map" + mapId + ".json");
    xhr.overrideMimeType('application/json');

    // on success callback
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var idx;

            (function () {
                if (xhr.status === 200 || xhr.responseText !== "") {
                    DataManager._tempTiledData = JSON.parse(xhr.responseText);
                }
                var tiledLoaded = true;
                var tilesRequired = 0;
                if (DataManager._tempTiledData && DataManager._tempTiledData.tilesets && DataManager._tempTiledData.tilesets.length > 0) {
                    var _loop = function _loop() {
                        var tileset = DataManager._tempTiledData.tilesets[idx];
                        if (tileset.source) {
                            var realTileset = TilesetManager.getTileset(tileset.source);
                            if (realTileset) {
                                DataManager._tempTiledData.tilesets[idx] = Object.assign({}, realTileset, { firstgid: DataManager._tempTiledData.tilesets[idx].firstgid });
                            } else {
                                tiledLoaded = false;
                                tilesRequired++;
                                +function (idx) {
                                    TilesetManager.loadTileset(tileset.source, function (returnTileset) {
                                        DataManager._tempTiledData.tilesets[idx] = Object.assign({}, returnTileset, { firstgid: DataManager._tempTiledData.tilesets[idx].firstgid });
                                        tilesRequired--;
                                        if (tilesRequired === 0) {
                                            DataManager._tiledLoaded = true;
                                        }
                                    });
                                }(idx);
                            }
                        }
                    };

                    for (idx = 0; idx < DataManager._tempTiledData.tilesets.length; idx++) {
                        _loop();
                    }
                }
                DataManager._tiledLoaded = tiledLoaded;
            })();
        }
    };

    // set data to null and send request
    this.unloadTiledMapData();
    xhr.send();
};

DataManager.unloadTiledMapData = function () {
    DataManager._tempTiledData = null;
    DataManager._tiledLoaded = false;
};

var _isMapLoaded = DataManager.isMapLoaded;
DataManager.isMapLoaded = function () {
    var defaultLoaded = _isMapLoaded.call(this);
    var tiledLoaded = DataManager._tiledLoaded;

    return defaultLoaded && tiledLoaded;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


ImageManager.loadParserTileset = function (path, hue) {
    if (!path) {
        return this.loadEmptyBitmap();
    }
    var paths = path.split("/");
    var filename = paths[paths.length - 1];
    var realPath = "img/tilesets/" + filename;

    return this.loadNormalBitmap(realPath, hue);
};

ImageManager.loadParserParallax = function (path, hue) {
    if (!path) {
        return this.loadEmptyBitmap();
    }
    var paths = path.split("/");
    var filename = paths[paths.length - 1];
    var realPath = "img/parallaxes/" + filename;

    return this.loadNormalBitmap(realPath, hue);
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//-----------------------------------------------------------------------------
// TiledManager
//
// The static class that manages TileD data, including extensions.

function TiledManager() {
    throw new Error('This is a static class');
}

window.TiledManager = TiledManager;

var _listeners = {};
var _hideFunctions = {};
var _hideIgnoreFunctions = {
    regions: [],
    collisions: [],
    levelChanges: [],
    tileFlags: []
};
var _tileFlags = {};
var _tileFlagIndex = 1;

TiledManager.addListener = function (objectName, listener, callback) {
    var recursive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    if (typeof objectName === 'function') {
        objectName = objectName.name;
    }
    if (!_listeners[objectName]) {
        _listeners[objectName] = {};
    }
    if (!_listeners[objectName][listener]) {
        _listeners[objectName][listener] = [];
    }
    callback.recursive = !!recursive;
    _listeners[objectName][listener].push(callback);
};

TiledManager.triggerListener = function (object, listener) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var objectName = object.constructor.name;
    if (!_listeners[objectName] || !_listeners[objectName][listener]) {
        return false;
    }
    var top = true;
    var proto = object.__proto__;
    while (proto) {
        objectName = proto.constructor.name;
        if (_listeners[objectName] && _listeners[objectName][listener]) {
            _listeners[objectName][listener].forEach(function (callback) {
                if (top || callback.recursive) {
                    callback.call(object, options);
                }
            });
        }
        top = false;
        proto = proto.__proto__;
    }
};

TiledManager.addHideFunction = function (id, callback) {
    var ignore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _hideFunctions[id] = callback;

    ignore.forEach(function (type) {
        _hideIgnoreFunctions[type].push(id);
    });
};

TiledManager.checkLayerHidden = function (layerData) {
    var ignore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (typeof ignore === 'string') {
        ignore = _hideIgnoreFunctions[ignore] || [];
    }
    var keys = Object.keys(_hideFunctions);
    var data = [false, false];
    for (var idx = 0; idx < keys.length; idx++) {
        if (ignore.indexOf(keys) !== -1) {
            continue;
        }
        if (layerData.properties && layerData.properties.hasOwnProperty(keys[idx])) {
            data[0] = true;
            data[1] = data[1] || _hideFunctions[keys[idx]](layerData);
        }
        if (data[1]) {
            return data;
        }
    }
    return data;
};

TiledManager.hasHideProperties = function (layerData) {
    return layerData.properties && Object.keys(_hideFunctions).filter(function (key) {
        return layerData.properties.hasOwnProperty(key);
    }).length > 0;
};

TiledManager.addFlag = function () {
    for (var _len = arguments.length, flagIds = Array(_len), _key = 0; _key < _len; _key++) {
        flagIds[_key] = arguments[_key];
    }

    flagIds.forEach(function (flagId) {
        _tileFlags[flagId] = _tileFlagIndex++;
    });
};

TiledManager.getFlag = function (flagId) {
    return _tileFlags[flagId];
};

TiledManager.getFlagNames = function () {
    return Object.keys(_tileFlags);
};

TiledManager.getFlagLocation = function (flagId) {
    var flag = _tileFlags[flagId];
    var bit = 1 << flag % 16 & 0xffff;
    var group = Math.floor(flag / 16);
    return [group, bit];
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// Constants

Object.defineProperty(Game_Map.prototype, 'tiledData', {
    get: function get() {
        return DataManager._tempTiledData;
    },
    configurable: true
});

Object.defineProperty(Game_Map.prototype, 'currentMapLevel', {
    get: function get() {
        var pluginParams = PluginManager.parameters("YED_Tiled");
        var varID = parseInt(pluginParams["Map Level Variable"]);
        if (!varID) {
            return this._currentMapLevel;
        } else {
            return $gameVariables.value(varID);
        }
    },
    set: function set(value) {
        var pluginParams = PluginManager.parameters("YED_Tiled");
        var varID = parseInt(pluginParams["Map Level Variable"]);
        if (!varID) {
            this._currentMapLevel = value;
        } else {
            $gameVariables.setValue(varID, value);
        }
    },
    configurable: true
});

var _setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function (mapId) {
    _setup.call(this, mapId);
    this._collisionMap = {};
    this._arrowCollisionMap = {};
    this._regions = {};
    this._mapLevelChange = {};
    this._positionHeightChange = {};
    this._tileFlags = {};
    this._collisionMapLayers = [];
    this._arrowCollisionMapLayers = [];
    this._regionsLayers = [];
    this._mapLevelChangeLayers = [];
    this._positionHeightChangeLayers = [];
    this._tileFlagsLayers = [];
    this._currentMapLevel = 0;
    this.currentMapLevel = 0;
    if (this.isTiledMap()) {
        $dataMap.width = this.tiledData.width;
        $dataMap.height = this.tiledData.height;
        this._setupTiled();
        this._tiledInitialized = true;
        if (this._refreshList) {
            this._refreshList.forEach(function (character) {
                character.refreshBushDepth();
            });
        }
    }
};

Game_Map.prototype.isTiledInitialized = function () {
    return !!this._tiledInitialized;
};

Game_Map.prototype.setRefreshDepth = function (character) {
    if (!this._refreshList) {
        this._refreshList = [];
    }
    this._refreshList.push(character);
};

Game_Map.prototype.isTiledMap = function () {
    return !!this.tiledData;
};

Game_Map.prototype._setupTiled = function () {
    this._initializeMapLevel(0);

    this._setupCollision();
    this._setupRegion();
    this._setupMapLevelChange();
    this._setupTileFlags();
    this._setupTiledEvents();
};

Game_Map.prototype._initializeMapLevel = function (id) {
    if (!!this._collisionMap[id]) {
        return;
    }

    this._collisionMap[id] = {};
    this._arrowCollisionMap[id] = {};
    this._regions[id] = {};
    this._mapLevelChange[id] = {};
    this._tileFlags[id] = {};
    this._collisionMapLayers[id] = [];
    this._arrowCollisionMapLayers[id] = [];
    this._regionsLayers[id] = [];
    this._mapLevelChangeLayers[id] = [];
    this._tileFlagsLayers[id] = [];
    this._initializeMapLevelData(id);
};

Game_Map.prototype._initializeMapLevelData = function () {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var layerId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'main';
    var dataTypes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var width = this.width();
    var height = this.height();
    var size = width * height;

    var defaultData = {
        'collisionMap': 0,
        'arrowCollisionMap': 1 | 2 | 4 | 8,
        'regions': 0,
        'mapLevelChange': -1,
        'positionHeightChange': -1,
        'tileFlags': 0
    };

    if (!dataTypes) {
        dataTypes = Object.keys(defaultData);
    }

    for (var idx = 0; idx < dataTypes.length; idx++) {
        var dataType = dataTypes[idx];
        var defaultValue = defaultData[dataType];
        if (!this['_' + dataType][id]) {
            this['_' + dataType][id] = {};
            this['_' + dataType + 'Layers'][id] = [];
        }
        if (!!this['_' + dataType][id][layerId]) {
            continue;
        }
        this['_' + dataType][id][layerId] = [];
        var typeData = this['_' + dataType][id][layerId];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Array(size).keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var x = _step.value;

                typeData.push(defaultValue);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
};

Game_Map.prototype._setupCollision = function () {
    this._setupCollisionFull();
    this._setupCollisionArrow();
};

Game_Map.prototype._setupCollisionFull = function () {
    var width = this.width();
    var height = this.height();
    var size = width * height;
    var halfWidth = width / 2;
    var halfHeight = height / 2;

    if (this.isHalfTile()) {
        size /= 4;
    }

    for (var idx = 0; idx < this.tiledData.layers.length; idx++) {
        var layerData = this.tiledData.layers[idx];
        if (!layerData.properties || !layerData.properties.collision) {
            continue;
        }

        if (layerData.properties.collision !== "full" && layerData.properties.collision !== "up-left" && layerData.properties.collision !== "up-right" && layerData.properties.collision !== "down-left" && layerData.properties.collision !== "down-right" && layerData.properties.collision !== "tiles") {
            continue;
        }

        var level = parseInt(layerData.properties.level) || 0;
        this._initializeMapLevel(level);

        var layerId = 'main';

        if (TiledManager.hasHideProperties(layerData)) {
            layerId = idx;
            this._collisionMapLayers[level].push(idx);
            this._initializeMapLevelData(level, layerId, ['collisionMap']);
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = Array(size).keys()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var x = _step2.value;

                var realX = x;
                var ids = [];
                if (this.isHalfTile()) {
                    realX = Math.floor(x / halfWidth) * width * 2 + x % halfWidth * 2;
                }
                if (!!layerData.data[x]) {
                    switch (layerData.properties.collision) {
                        case "full":
                            ids.push(realX);
                            if (this.isHalfTile()) {
                                ids.push(realX + 1, realX + width, realX + width + 1);
                            }
                            break;
                        case "up-left":
                            ids.push(realX);
                            break;
                        case "up-right":
                            ids.push(realX + 1);
                            break;
                        case "down-left":
                            ids.push(realX + width);
                            break;
                        case "down-right":
                            ids.push(realX + width + 1);
                            break;
                        case "tiles":
                            var tileId = layerData.data[x];
                            var tileset = this._getTileset(tileId);
                            if (tileset && tileset.tileproperties) {
                                var tileData = tileset.tileproperties[tileId - tileset.firstgid];
                                if (tileData) {
                                    if (tileData.collision) {
                                        ids.push(realX);
                                        if (this.isHalfTile()) {
                                            ids.push(realX + 1, realX + width, realX + width + 1);
                                        }
                                    }
                                    if (tileData.collisionUpLeft) {
                                        ids.push(realX);
                                    }
                                    if (tileData.collisionUpRight) {
                                        ids.push(realX + 1);
                                    }
                                    if (tileData.collisionDownLeft) {
                                        ids.push(realX + width);
                                    }
                                    if (tileData.collisionDownRight) {
                                        ids.push(realX + width + 1);
                                    }
                                }
                            }
                            break;
                    }
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = ids[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var id = _step3.value;

                            this._collisionMap[level][layerId][id] = 1;
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    }
};

Game_Map.prototype._setupCollisionArrow = function () {
    var width = this.width();
    var height = this.height();
    var size = width * height;
    var bit = 0;
    var halfWidth = width / 2;
    var halfHeight = height / 2;

    if (this.isHalfTile()) {
        size /= 4;
    }

    for (var idx = 0; idx < this.tiledData.layers.length; idx++) {
        var layerData = this.tiledData.layers[idx];
        if (!layerData.properties || !layerData.properties.collision) {
            continue;
        }

        if (layerData.properties.collision !== "arrow" && layerData.properties.collision !== "tiles") {
            continue;
        }

        if (!layerData.properties.arrowImpassable && layerData.properties.collision !== "tiles") {
            continue;
        }

        if (layerData.properties.arrowImpassable) {

            if (layerData.properties.arrowImpassable === "down") {
                bit = 1;
            }

            if (layerData.properties.arrowImpassable === "left") {
                bit = 2;
            }

            if (layerData.properties.arrowImpassable === "right") {
                bit = 4;
            }

            if (layerData.properties.arrowImpassable === "up") {
                bit = 8;
            }
        }

        var level = parseInt(layerData.properties.level) || 0;
        this._initializeMapLevel(level);

        var layerId = 'main';

        if (TiledManager.hasHideProperties(layerData)) {
            layerId = idx;
            this._arrowCollisionMapLayers[level].push(idx);
            this._initializeMapLevelData(level, layerId, ['arrowCollisionMap']);
        }

        var arrowCollisionMap = this._arrowCollisionMap[level][layerId];
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = Array(size).keys()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var x = _step4.value;

                var realX = x;
                if (this.isHalfTile()) {
                    realX = Math.floor(x / halfWidth) * width * 2 + x % halfWidth * 2;
                }

                if (!!layerData.data[x]) {
                    var realBit = bit;
                    if (layerData.properties.collision === "tiles") {
                        realBit = 0;
                        var tileId = layerData.data[x];
                        var tileset = this._getTileset(tileId);
                        if (tileset && tileset.tileproperties) {
                            var tileData = tileset.tileproperties[tileId - tileset.firstgid];
                            if (tileData) {
                                if (tileData.arrowImpassableDown) {
                                    realBit += 1;
                                }
                                if (tileData.arrowImpassableLeft) {
                                    realBit += 2;
                                }
                                if (tileData.arrowImpassableRight) {
                                    realBit += 4;
                                }
                                if (tileData.arrowImpassableUp) {
                                    realBit += 8;
                                }
                            }
                        }
                    }
                    arrowCollisionMap[realX] = arrowCollisionMap[realX] ^ realBit;
                    if (this.isHalfTile()) {
                        arrowCollisionMap[realX + 1] = arrowCollisionMap[realX + 1] ^ realBit;
                        arrowCollisionMap[realX + width] = arrowCollisionMap[realX + width] ^ realBit;
                        arrowCollisionMap[realX + width + 1] = arrowCollisionMap[realX + width + 1] ^ realBit;
                    }
                }
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }
    }
};

Game_Map.prototype._setupRegion = function () {
    var width = this.width();
    var height = this.height();
    var size = width * height;
    var halfWidth = width / 2;
    var halfHeight = height / 2;

    if (this.isHalfTile()) {
        size /= 4;
    }

    for (var idx = 0; idx < this.tiledData.layers.length; idx++) {
        var layerData = this.tiledData.layers[idx];
        if (!layerData.properties || !layerData.properties.regionId) {
            continue;
        }

        var level = parseInt(layerData.properties.level) || 0;
        this._initializeMapLevel(level);

        var layerId = 'main';

        if (TiledManager.hasHideProperties(layerData)) {
            layerId = idx;
            this._regionsLayers[level].push(idx);
            this._initializeMapLevelData(level, layerId, ['regions']);
        }

        var _regionMap = this._regions[level][layerId];

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = Array(size).keys()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var x = _step5.value;

                var realX = x;
                if (this.isHalfTile()) {
                    realX = Math.floor(x / halfWidth) * width * 2 + x % halfWidth * 2;
                }

                if (!!layerData.data[x]) {
                    var regionId = 0;
                    if (layerData.properties.regionId > -1) {
                        regionId = parseInt(layerData.properties.regionId);
                    } else {
                        var tileId = layerData.data[x];
                        var tileset = this._getTileset(tileId);
                        if (tileset && tileset.tileproperties) {
                            var tileData = tileset.tileproperties[tileId - tileset.firstgid];
                            if (tileData && tileData.regionId) {
                                regionId = parseInt(tileData.regionId);
                            }
                        }
                        if (layerData.properties.regionOffset) {
                            regionId += layerData.properties.regionOffset;
                        }
                    }
                    _regionMap[realX] = regionId;
                    if (this.isHalfTile()) {
                        _regionMap[realX + 1] = regionId;
                        _regionMap[realX + width] = regionId;
                        _regionMap[realX + width + 1] = regionId;
                    }
                }
            }
        } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                    _iterator5.return();
                }
            } finally {
                if (_didIteratorError5) {
                    throw _iteratorError5;
                }
            }
        }
    }
};

Game_Map.prototype._setupMapLevelChange = function () {
    var width = this.width();
    var height = this.height();
    var size = width * height;
    var halfWidth = width / 2;
    var halfHeight = height / 2;

    if (this.isHalfTile()) {
        size /= 4;
    }

    for (var idx = 0; idx < this.tiledData.layers.length; idx++) {
        var layerData = this.tiledData.layers[idx];
        if (!layerData.properties || !layerData.properties.hasOwnProperty('toLevel')) {
            continue;
        }

        var level = parseInt(layerData.properties.level) || 0;
        this._initializeMapLevel(level);
        var layerId = 'main';

        if (TiledManager.hasHideProperties(layerData)) {
            layerId = idx;
            this._mapLevelChangeLayers[level].push(idx);
            this._initializeMapLevelData(level, layerId, ['mapLevelChange']);
        }

        var levelChangeMap = this._mapLevelChange[level][layerId];

        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = Array(size).keys()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var x = _step6.value;

                var realX = x;
                var toLevel = parseInt(layerData.properties.toLevel);
                if (this.isHalfTile()) {
                    realX = Math.floor(x / halfWidth) * width * 2 + x % halfWidth * 2;
                }

                if (!!layerData.data[x]) {
                    levelChangeMap[realX] = toLevel;
                    if (this.isHalfTile()) {
                        levelChangeMap[realX + 1] = toLevel;
                        levelChangeMap[realX + width] = toLevel;
                        levelChangeMap[realX + width + 1] = toLevel;
                    }
                }
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }
    }
};

Game_Map.prototype._setupPositionHeightChange = function () {
    var width = this.width();
    var height = this.height();
    var size = width * height;
    var halfWidth = width / 2;
    var halfHeight = height / 2;

    if (this.isHalfTile()) {
        size /= 4;
    }

    for (var idx = 0; idx < this.tiledData.layers.length; idx++) {
        var layerData = this.tiledData.layers[idx];
        if (!layerData.properties || !layerData.properties.hasOwnProperty('floorHeight')) {
            continue;
        }

        var level = parseInt(layerData.properties.level) || 0;
        this._initializeMapLevel(level);
        var layerId = 'main';

        if (TiledManager.hasHideProperties(layerData)) {
            layerId = idx;
            this._positionHeightChangeLayers[level].push(idx);
            this._initializeMapLevelData(level, layerId, ['positionHeightChange']);
        }

        var positionHeightChangeMap = this._positionHeightChange[level][layerId];

        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
            for (var _iterator7 = Array(size).keys()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var x = _step7.value;

                var realX = x;
                var toLevel = parseInt(layerData.properties.floorHeight);
                if (this.isHalfTile()) {
                    realX = Math.floor(x / halfWidth) * width * 2 + x % halfWidth * 2;
                }

                if (!!layerData.data[x]) {
                    positionHeightChangeMap[realX] = toLevel;
                    if (this.isHalfTile()) {
                        positionHeightChangeMap[realX + 1] = toLevel;
                        positionHeightChangeMap[realX + width] = toLevel;
                        positionHeightChangeMap[realX + width + 1] = toLevel;
                    }
                }
            }
        } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                    _iterator7.return();
                }
            } finally {
                if (_didIteratorError7) {
                    throw _iteratorError7;
                }
            }
        }
    }
};

Game_Map.prototype._setupTileFlags = function () {
    var width = this.width();
    var height = this.height();
    var size = width * height;
    var halfWidth = width / 2;
    var halfHeight = height / 2;

    if (this.isHalfTile()) {
        size /= 4;
    }

    for (var idx = 0; idx < this.tiledData.layers.length; idx++) {
        var layerData = this.tiledData.layers[idx];
        if (!layerData.properties || !layerData.properties.tileFlags) {
            continue;
        }

        var level = parseInt(layerData.properties.level) || 0;
        this._initializeMapLevel(level);

        var layerId = 'main';

        if (TiledManager.hasHideProperties(layerData)) {
            layerId = idx;
            this._tileFlagsLayers[level].push(idx);
            this._initializeMapLevelData(level, layerId, ['tileFlags']);
        }

        var tileFlagMap = this._tileFlags[level][layerId];

        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
            for (var _iterator8 = Array(size).keys()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                var x = _step8.value;

                var realX = x;
                if (this.isHalfTile()) {
                    realX = Math.floor(x / halfWidth) * width * 2 + x % halfWidth * 2;
                }

                if (!!layerData.data[x]) {
                    var tileFlags = 0;
                    var tileId = layerData.data[x];
                    var tileset = this._getTileset(tileId);
                    if (tileset && tileset.tileproperties) {
                        var tileData = tileset.tileproperties[tileId - tileset.firstgid];
                        if (tileData) {
                            tileFlags = this._getTileFlags(tileData);
                        }
                    }
                    tileFlagMap[realX] = this._combineFlags(tileFlagMap[realX], tileFlags);
                    if (this.isHalfTile()) {
                        tileFlagMap[realX + 1] = this._combineFlags(tileFlagMap[realX + 1], tileFlags);
                        tileFlagMap[realX + width] = this._combineFlags(tileFlagMap[realX + width], tileFlags);
                        tileFlagMap[realX + width + 1] = this._combineFlags(tileFlagMap[realX + width + 1], tileFlags);
                    }
                }
            }
        } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion8 && _iterator8.return) {
                    _iterator8.return();
                }
            } finally {
                if (_didIteratorError8) {
                    throw _iteratorError8;
                }
            }
        }
    }
};

Game_Map.prototype._getTileFlags = function (tileData) {
    var flags = [];
    var flagNames = TiledManager.getFlagNames();
    flagNames.forEach(function (prop) {
        var property = 'flagIs' + prop.slice(0, 1).toUpperCase() + prop.slice(1);
        if (tileData[property]) {
            var _TiledManager$getFlag = TiledManager.getFlagLocation(prop),
                _TiledManager$getFlag2 = _slicedToArray(_TiledManager$getFlag, 2),
                group = _TiledManager$getFlag2[0],
                bit = _TiledManager$getFlag2[1];

            for (var _i = flags.length; _i <= group; _i++) {
                flags.push(0);
            }
            flags[group] |= bit;
        }
    });
    return flags.length > 0 ? flags : 0;
};

Game_Map.prototype._combineFlags = function (source, target) {
    source = source ? source.slice(0) : [];
    for (var _i2 = 0; _i2 < target.length; _i2++) {
        if (!source.length <= _i2) {
            source.push(_i2);
        }
        source[_i2] |= target[_i2];
    }
    return source;
};

Game_Map.prototype._setupTiledEvents = function () {
    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
        for (var _iterator9 = this.tiledData.layers[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var layerData = _step9.value;

            if (layerData.type !== "objectgroup") {
                continue;
            }

            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = layerData.objects[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var object = _step10.value;

                    if (!object.properties) {
                        continue;
                    }

                    if (!object.properties.eventId) {
                        continue;
                    }

                    var eventId = parseInt(object.properties.eventId);
                    var event = this._events[eventId];
                    if (!event) {
                        continue;
                    }
                    var x = Math.floor(object.x / this.tileWidth());
                    var y = Math.floor(object.y / this.tileHeight());
                    if (this.isHalfTile()) {
                        x += 1;
                        y += 1;
                    }
                    event.locate(x, y);
                    event._tiledProperties = object.properties;
                }
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                        _iterator10.return();
                    }
                } finally {
                    if (_didIteratorError10) {
                        throw _iteratorError10;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                _iterator9.return();
            }
        } finally {
            if (_didIteratorError9) {
                throw _iteratorError9;
            }
        }
    }
};

Game_Map.prototype.isHalfTile = function () {
    var pluginParams = PluginManager.parameters("YED_Tiled");
    return pluginParams["Half-tile movement"].toLowerCase() === "true";
};

Game_Map.prototype._getTileset = function (tileId) {
    for (var idx = 0; idx < this.tiledData.tilesets.length; idx++) {
        var tileset = this.tiledData.tilesets[idx];
        if (tileId >= tileset.firstgid && tileId < tileset.firstgid + tileset.tilecount) {
            return tileset;
        }
    }
    return null;
};

Game_Map.prototype.tileWidth = function () {
    var tileWidth = this.tiledData.tilewidth;
    if (this.isHalfTile()) {
        tileWidth /= 2;
    }
    return tileWidth;
};

Game_Map.prototype.tileHeight = function () {
    var tileHeight = this.tiledData.tileheight;
    if (this.isHalfTile()) {
        tileHeight /= 2;
    }
    return tileHeight;
};

Game_Map.prototype.width = function () {
    var width = this.tiledData.width;
    if (this.isHalfTile()) {
        width *= 2;
    }
    return width;
};

Game_Map.prototype.height = function () {
    var height = this.tiledData.height;
    if (this.isHalfTile()) {
        height *= 2;
    }
    return height;
};

var _regionId = Game_Map.prototype.regionId;
Game_Map.prototype.regionId = function (x, y) {
    var allIds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!this.isTiledMap()) {
        return _regionId.call(this, x, y);
    }

    var index = x + this.width() * y;
    var regionMap = this._regions[this.currentMapLevel];
    var regionLayer = this._regionsLayers[this.currentMapLevel];

    var regionValue = regionMap.main[index];
    var regionValues = [regionValue];

    if (regionLayer && regionLayer.length > 0) {
        for (var idx = 0; idx < regionLayer.length; idx++) {
            var layerId = regionLayer[idx];
            var layerData = this.tiledData.layers[layerId];
            var hideData = TiledManager.checkLayerHidden(layerData, 'regions');
            if (!hideData[1]) {
                if (allIds) {
                    regionValues.push(regionMap[layerId][index]);
                } else {
                    regionValue = regionMap[layerId][index];
                }
            }
        }
    }

    return allIds ? regionValues : regionValue;
};

Game_Map.prototype.regionIds = function (x, y) {
    return this.regionId(x, y, true);
};

var _checkPassage = Game_Map.prototype.checkPassage;
Game_Map.prototype.checkPassage = function (x, y, bit) {
    var render = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var level = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    if (!this.isTiledMap()) {
        return _checkPassage.call(this, x, y, d);
    }
    if (level === false) {
        level = this._currentMapLevel;
    }
    var index = x + this.width() * y;
    var arrows = this._arrowCollisionMap[level];
    var arrowLayer = this._arrowCollisionMapLayers[level];
    var arrowValue = arrows.main[index];

    if (render && arrows[render]) {
        arrowValue = arrows[render][index];
    } else if (arrowLayer && arrowLayer.length > 0) {
        for (var idx = 0; idx < arrowLayer.length; idx++) {
            var layerId = arrowLayer[idx];
            var layerData = this.tiledData.layers[layerId];
            var hideData = TiledManager.checkLayerHidden(layerData, 'collisions');
            if (!hideData[1]) {
                arrowValue &= regionMap[layerId][index];
            }
        }
    }

    return (arrowValue & bit) > 0;
};

Game_Map.prototype.renderPassage = function (x, y, bit) {
    var render = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'main';
    var level = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    if (level === false) {
        level = 0;
    }
    if (render && !this._arrowCollisionMap[level][render]) {
        render = 'main';
    }
    return this.checkPassage(x, y, bit, render, level);
};

Game_Map.prototype.getPassageLayers = function (level) {
    return this._arrowCollisionMapLayers[level].slice(0);
};

var _isPassable = Game_Map.prototype.isPassable;
Game_Map.prototype.isPassable = function (x, y, d) {
    var render = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var level = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    if (!this.isTiledMap()) {
        return _isPassable.call(this, x, y, d);
    }
    if (level === false) {
        level = this._currentMapLevel;
    }

    if (!this.checkPassage(x, y, 1 << d / 2 - 1 & 0x0f, render)) {
        return false;
    }

    var index = x + this.width() * y;
    var collisionMap = this._collisionMap[level];
    var collisionLayer = this._collisionMapLayers[level];
    var collisionValue = collisionMap.main[index];

    if (render && collisionMap[render]) {
        collisionValue = collisionMap[render][index];
    } else if (collisionLayer && collisionLayer.length > 0) {
        for (var idx = 0; idx < collisionLayer.length; idx++) {
            var layerId = collisionLayer[idx];
            var layerData = this.tiledData.layers[layerId];
            var hideData = TiledManager.checkLayerHidden(layerData, 'collisions');
            if (!hideData[1]) {
                collisionValue |= collisionMap[layerId][index];
            }
        }
    }

    return collisionValue === 0;
};

Game_Map.prototype.renderIsPassable = function (x, y, d) {
    var render = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'main';
    var level = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    if (level === false) {
        level = 0;
    }
    if (render && !this._collisionMap[level][render]) {
        render = 'main';
    }
    return this.isPassable(x, y, d, render, level);
};

Game_Map.prototype.getIsPassableLayers = function (level) {
    return this._collisionMapLayers[level].slice(0);
};

Game_Map.prototype.checkMapLevelChanging = function (x, y) {
    var mapLevelChange = this._mapLevelChange[this.currentMapLevel];
    var mapLevelChangeLayer = this._mapLevelChangeLayers[this.currentMapLevel];
    var index = y * this.width() + x;
    var mapLevelChangeValue = mapLevelChange.main[index];
    if (mapLevelChangeLayer.length > 0) {
        for (var idx = 0; idx < mapLevelChangeLayer.length; idx++) {
            var layerId = mapLevelChangeLayer[idx];
            var layerData = this.tiledData.layers[layerId];
            var hideData = TiledManager.checkLayerHidden(layerData, 'levelChanges');
            if (!hideData[1]) {
                mapLevelChangeValue = mapLevelChange[layerId][index];
            }
        }
    }
    if (mapLevelChangeValue < 0) {
        return false;
    }
    this.currentMapLevel = mapLevelChangeValue;
    return true;
};

Game_Map.prototype.checkPositionHeight = function (x, y) {
    var positionHeightChange = this._positionHeightChange[this.currentMapLevel];
    var positionHeightChangeLayer = this._positionHeightChangeLayers[this.currentMapLevel];
    var index = y * this.width() + x;
    var positionHeightChangeValue = positionHeightChange.main[index];
    if (positionHeightChangeLayer.length > 0) {
        for (var idx = 0; idx < positionHeightChangeLayer.length; idx++) {
            var layerId = positionHeightChangeLayer[idx];
            var layerData = this.tiledData.layers[layerId];
            var hideData = TiledManager.checkLayerHidden(layerData, 'positionHeightChanges');
            if (!hideData[1]) {
                positionHeightChangeValue = positionHeightChange[layerId][index];
            }
        }
    }
    return positionHeightChangeValue;
};

Game_Map.prototype.getTileFlags = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (level === false) {
        level = 0;
    }
    var index = x + this.width() * y;
    var tileFlags = this._tileFlags[level];
    var tileFlagsLayer = this._tileFlagsLayers[level];
    var tileFlagsValue = tileFlags.main[index] ? tileFlags.main[index].slice(0) : [];

    if (render && tileFlags[render]) {
        tileFlagsValue = tileFlags[render][index] ? tileFlags[render][index].slice(0) : [];
    } else if (tileFlagsLayer && tileFlagsLayer.length > 0) {
        for (var idx = 0; idx < tileFlagsLayer.length; idx++) {
            var layerId = tileFlagsLayer[idx];
            var layerData = this.tiledData.layers[layerId];
            var hideData = TiledManager.checkLayerHidden(layerData, 'tileFlags');
            if (!hideData[1] && tileFlags[layerId][index]) {
                tileFlagsValue[i] = this._combineFlags(tileFlagsValue[i], tileFlags[layerId][index]);
            }
        }
    }
    return tileFlagsValue;
};

Game_Map.prototype.renderTileFlags = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'main';
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (level === false) {
        level = 0;
    }
    if (render && !this._tileFlags[level][render]) {
        render = 'main';
    }
    return this.getTileFlags(x, y, render, level);
};

Game_Map.prototype.checkHasTileFlag = function (x, y, flag) {
    var render = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var level = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    if (level === false) {
        level = 0;
    }
    if (typeof flag === 'string') {
        flag = TiledManager.getFlag(flag);
    }
    var bit = 1 << flag % 16 & 0xffff;
    var group = Math.floor(flag / 16);
    var tileFlagsValue = this.getTileFlags(x, y, render, level);

    return (tileFlagsValue[group] & bit) > 0;
};

Game_Map.prototype.renderHasTileFlag = function (x, y, flag) {
    var render = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'main';
    var level = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    if (level === false) {
        level = 0;
    }
    if (render && !this._tileFlags[level][render]) {
        render = 'main';
    }
    return this.checkHasTileFlag(x, y, flag, render, level);
};

var _isBoatPassable = Game_Map.prototype.isBoatPassable;
Game_Map.prototype.isBoatPassable = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (!this.isTiledMap()) {
        return _isBoatPassable.call(this, x, y);
    }
    if (level === false) {
        level = 0;
    }
    return this.checkHasTileFlag(x, y, 'boat', render, level);
};

Game_Map.prototype.renderIsBoatPassable = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'main';
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (level === false) {
        level = 0;
    }
    return this.isBoatPassable(x, y, render, level);
};

var _isShipPassable = Game_Map.prototype.isShipPassable;
Game_Map.prototype.isShipPassable = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (!this.isTiledMap()) {
        return _isShipPassable.call(this, x, y);
    }
    if (level === false) {
        level = 0;
    }
    return this.checkHasTileFlag(x, y, 'ship', render);
};

Game_Map.prototype.renderIsShipPassable = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'main';
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (level === false) {
        level = 0;
    }
    return this.isShipPassable(x, y, render, level);
};

var _isAirshipLandOk = Game_Map.prototype.isAirshipLandOk;
Game_Map.prototype.isAirshipLandOk = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (!this.isTiledMap()) {
        return _isAirshipLandOk.call(this, x, y);
    }
    if (level === false) {
        level = 0;
    }
    return this.checkHasTileFlag(x, y, 'airship', render) && this.checkPassage(x, y, 0x0f, render);
};

Game_Map.prototype.renderIsAirshipLandOk = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'main';
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (level === false) {
        level = 0;
    }
    return this.isAirshipLandOk(x, y, render, level);
};

var _isLadder = Game_Map.prototype.isLadder;
Game_Map.prototype.isLadder = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (!this.isTiledMap()) {
        return _isLadder.call(this, x, y);
    }
    if (level === false) {
        level = 0;
    }
    return this.isValid(x, y) && this.checkHasTileFlag(x, y, 'ladder', render);
};

Game_Map.prototype.renderIsLadder = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'main';
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (level === false) {
        level = 0;
    }
    return this.isLadder(x, y, render, level);
};

var _isBush = Game_Map.prototype.isBush;
Game_Map.prototype.isBush = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (!this.isTiledMap()) {
        return _isBush.call(this, x, y);
    }
    if (level === false) {
        level = 0;
    }
    return this.isValid(x, y) && this.checkHasTileFlag(x, y, 'bush', render);
};

Game_Map.prototype.renderIsBush = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'main';
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (level === false) {
        level = 0;
    }
    return this.isBush(x, y, render, level);
};

var _isCounter = Game_Map.prototype.isCounter;
Game_Map.prototype.isCounter = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (!this.isTiledMap()) {
        return _isCounter.call(this, x, y);
    }
    if (level === false) {
        level = 0;
    }
    return this.isValid(x, y) && this.checkHasTileFlag(x, y, 'counter', render);
};

Game_Map.prototype.renderIsCounter = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'main';
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (level === false) {
        level = 0;
    }
    return this.isCounter(x, y, render, level);
};

var _isDamageFloor = Game_Map.prototype.isDamageFloor;
Game_Map.prototype.isDamageFloor = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (!this.isTiledMap()) {
        return _isDamageFloor.call(this, x, y);
    }
    if (level === false) {
        level = 0;
    }
    return this.isValid(x, y) && this.checkHasTileFlag(x, y, 'damage', render);
};

Game_Map.prototype.renderIsDamageFloor = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'main';
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (level === false) {
        level = 0;
    }
    return this.isDamageFloor(x, y, render, level);
};

Game_Map.prototype.isSlipperyFloor = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (level === false) {
        level = 0;
    }
    return this.isValid(x, y) && this.checkHasTileFlag(x, y, 'ice', render);
};

Game_Map.prototype.renderIsSlipperyFloor = function (x, y) {
    var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'main';
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (level === false) {
        level = 0;
    }
    return this.isSlipperyFloor(x, y, render, level);
};

Game_Map.prototype.getLayerProperties = function () {
    var layer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
    var ignoreHidden = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (layer > -1) {
        if (this.tiledData.layers[layer] && this.tiledData.layers[layer].properties) {
            return Object.assign({}, this.tiledData.layers[layer].properties);
        }
        return {};
    }
    var layerProperties = {};
    this.tiledData.layers.forEach(function (layerData, i) {
        if (layerData && layerData.properties) {
            if (!ignoreHidden || !TiledManager.checkLayerHidden(layerData, 'collisions')[1]) {
                layerProperties[i] = Object.assign({}, layerData.properties);
            }
        }
    });
    return layerProperties;
};

Game_Map.prototype.getTileProperties = function (x, y) {
    var _this = this;

    var layer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
    var ignoreHidden = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    var index = x + this.width() * y;

    if (layer > -1) {
        if (this.tiledData.layers[layer]) {
            var tileId = this.tiledData.layers[layer].data[x];
            var tileset = this._getTileset(tileId);
            if (tileset && tileset.tileproperties) {
                return Object.assign({}, tileset.tileproperties[tileId - tileset.firstgid]);
            }
        }
        return {};
    }
    var tileProperties = {};
    this.tiledData.layers.forEach(function (layerData, i) {
        if (layerData && layerData.properties) {
            if (!ignoreHidden || !TiledManager.checkLayerHidden(layerData)[1]) {
                var props = _this.getTileProperties(x, y, i);
                if (Object.keys(props).length > 0) {
                    tileProperties[i] = props;
                }
            }
        }
    });
    return tileProperties;
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var pluginParams = PluginManager.parameters("YED_Tiled");

Game_CharacterBase.prototype.screenZ = function () {
    if (this._priorityType == 0) {
        return parseInt(pluginParams["Z - Below Player"]);
    }
    if (this._priorityType == 2) {
        return parseInt(pluginParams["Z - Above Player"]);
    }
    return parseInt(pluginParams["Z - Player"]);
};

var _distancePerFrame = Game_CharacterBase.prototype.distancePerFrame;
Game_CharacterBase.prototype.distancePerFrame = function () {
    var distance = _distancePerFrame.call(this);
    return distance * (48 / Math.min($gameMap.tileWidth(), $gameMap.tileHeight()));
};

var _refreshBushDepth = Game_CharacterBase.prototype.refreshBushDepth;
Game_CharacterBase.prototype.refreshBushDepth = function () {
    this._bushDepth = 0;
    if (!$gameMap.isTiledMap() || $gameMap.isTiledInitialized()) {
        _refreshBushDepth.call(this);
    } else {
        $gameMap.setRefreshDepth(this);
    }
};

var _updateMove = Game_CharacterBase.prototype.updateMove;
Game_CharacterBase.prototype.updateMove = function () {
    var hori = this._realX > this._x ? 4 : this._realX < this._x ? 6 : 0;
    var vert = this._realY > this._y ? 8 : this._realY < this._y ? 2 : 0;
    var d = hori + vert;
    _updateMove.call(this);
    if (!this.isMoving() || pluginParams["Position Height - Always Check On Move Update"].toLowerCase() === "true") {
        var newLocationHeight = $gameMap.checkPositionHeight(this._x, this._y);
        if (newLocationHeight > -1) {
            this._locationHeight = newLocationHeight;
        }
    }
    if (!this.isMoving() && $gameMap.isSlipperyFloor(this._x, this._y)) {
        TiledManager.triggerListener(this, 'slipperyfloor', {
            d: d
        });
    }
};

Game_CharacterBase.prototype.locationHeight = function () {
    return this._locationHeight || 0;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _checkEventTriggerHere = Game_Player.prototype.checkEventTriggerHere;
Game_Player.prototype.checkEventTriggerHere = function (triggers) {
    _checkEventTriggerHere.call(this, triggers);
    this._checkMapLevelChangingHere();
};

Game_Player.prototype._checkMapLevelChangingHere = function () {
    $gameMap.checkMapLevelChanging(this.x, this.y);
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function () {
	_update.call(this);
	this.locationHeight = this._character.locationHeight();
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _TiledTilemap = __webpack_require__(0);

var _createTilemap = Spriteset_Map.prototype.createTilemap;
Spriteset_Map.prototype.createTilemap = function () {
    if (!$gameMap.isTiledMap()) {
        _createTilemap.call(this);
        return;
    }
    this._tilemap = new _TiledTilemap.TiledTilemap($gameMap.tiledData);
    this._tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
    this._tilemap.verticalWrap = $gameMap.isLoopVertical();
    this.loadTileset();
    this._baseSprite.addChild(this._tilemap);
};

var _loadTileset = Spriteset_Map.prototype.loadTileset;
Spriteset_Map.prototype.loadTileset = function () {
    if (!$gameMap.isTiledMap()) {
        _loadTileset.call(this);
        return;
    }

    var i = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = $gameMap.tiledData.tilesets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var tileset = _step.value;

            this._tilemap.bitmaps[i] = ImageManager.loadParserTileset(tileset.image, 0);
            i++;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    this._tilemap.refreshTileset();
    this._tileset = $gameMap.tiledData.tilesets;
};

var _update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function () {
    _update.call(this);
    this._updateHideOnLevel();
    this._updateHideOnSpecial();
};

Spriteset_Map.prototype.updateTileset = function () {
    if (this._tileset !== $gameMap.tiledData.tilesets) {
        this.loadTileset();
    }
};

Spriteset_Map.prototype._updateHideOnLevel = function () {
    this._tilemap.hideOnLevel($gameMap.currentMapLevel);
};

Spriteset_Map.prototype._updateHideOnSpecial = function () {
    if ($gamePlayer && $gameMap) {
        this._tilemap.hideOnSpecial();
    }
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

Sprite_TiledPriorityTile.prototype.updateVisibility = function () {
    this.visible = this.layerId === -1 || !TiledManager.checkLayerHidden($gameMap.tiledData.layers[this.layerId])[1];
};

/***/ })
/******/ ]);
//# sourceMappingURL=YED_Tiled.js.map