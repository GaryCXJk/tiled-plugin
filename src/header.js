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
 * @param Constrain Events to Grid
 * @desc Whether events should be constrained to a grid or not.
 * @default true
 * @type boolean
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
