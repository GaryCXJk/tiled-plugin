/******************************************************************************
 * YED_Tiled.js                                                               *
 ******************************************************************************
 * Tiled Plugin v2.00                                                         *
 * By Archeia and Dr. Yami                                                    *
 ******************************************************************************
 * License: Custom                                                            *
 ******************************************************************************
 * You are free to use this plugin for your own project, both in commercial   *
 * as well as non-commercial projects, free of charge. Do not claim this      *
 * plugin as your own.                                                        *
 ******************************************************************************/

/*:
 * @plugindesc v2.00 Plugin supports Tiled Map Editor maps with some additional
 * features.
 * @author Dr.Yami
 *
 * @param Files
 *
 * @param Maps Location
 * @parent Files
 * @desc The folder where maps are located.
 * Default: maps/
 * @default maps/
 *
 * @param Tilesets Location
 * @parent Files
 * @desc The folder where tilesets are located.
 * Default: tilesets/
 * @default tilesets/
 *
 * @param Z Indexes
 *
 * @param Z - Player
 * @parent Z Indexes
 * @desc Z Index for Same as Characters events and Players.
 * Default: 3
 * @default 3
 * @type number
 *
 * @param Z - Below Player
 * @parent Z Indexes
 * @desc Z Index for Below Characters events.
 * Default: 1
 * @default 1
 * @type number
 *
 * @param Z - Above Player
 * @parent Z Indexes
 * @desc Z Index for Above Characters events.
 * Default: 5
 * @default 5
 * @type number
 *
 * @param Tile Settings
 * 
 * @param Half-tile movement
 * @parent Tile Settings
 * @desc Moving and collision checking by half a tile.
 * Can be true or false
 * @default true
 * @type boolean
 *
 * @param Priority Tiles Limit
 * @parent Tile Settings
 * @desc Limit for priority tile sprites.
 * Should not be too large.
 * @default 256
 * @type number
 *
 * @param Basic Floor Damage
 * @parent Tile Settings
 * @desc The basic floor damage.
 * @type number
 * @min 1
 * @default 10
 * 
 * @param Basic Floor Heal
 * @parent Tile Settings
 * @desc The basic floor heal.
 * @type number
 * @min 1
 * @default 10
 *
 * @param Floor HP Calculation
 * @parent Tile Settings
 * @desc How to calculate floor damage or heal if more than one tile has the floorDamage or floorHeal tile property.
 * @type select
 * @option Sum
 * @option Average
 * @option Top
 * @default Top
 *
 * @param Map Level Variable
 * @desc Get and set map level by variable.
 * @default 0
 * @type number
 * 
 * @param Constrain Events to Grid
 * @desc Whether events should be constrained to a grid or not.
 * @default true
 * @type boolean
 * 
 * @param Position Height - Always Check On Move Update
 * @desc Whether the position height should update on every move tick or just the final.
 * @default false
 * @type boolean
 * 
 * @help
 * ============================================================================
 * = About                                                                    =
 * ============================================================================
 *
 * * Tired of RPG Maker MV's Map Editor?
 * * Do you want to map the XP way but more?
 * * Tired of Parallax Mapping?
 * * Want to do round corners?
 * * Want to create a map with basically unlimited layers?
 *
 * Well, now all those worries are gone! Instead, let's just use the awesome
 * map editor, Tiled! Free, easy to use and very flexible Map Editor. This is
 * one of our reveals for RMMV's release but due to unforeseen circumstances,
 * we were unable to showcase this really awesome plugin in RPG Maker Channel.
 *
 * - Archeia and Dr. Yami
 *
 * Tiled is a separate application developed by Bjorn, and you can find it
 * here:
 *
 * http://www.mapeditor.org/
 *
 * ============================================================================
 * = Usage                                                                    =
 * ============================================================================
 *
 * Just put this script as high as possible, preferably before plugins that
 * extend functionality of maps and rendering thereof, but after any plugin
 * that rewrites map handling. Ideally, you'd only have to use this plugin for
 * any of your mapping needs.
 *
 * Note that the Tiled plugin handles the following:
 * - Map layouts and rendering
 * - Regions
 * - Collisions
 * - Parallax images
 *
 * Note that this guide won't explain how to use Tiled itself, this will only
 * go over the plugin specific features.
 *
 * ----------------------------------------------------------------------------
 * - Starting your project                                                    -
 * ----------------------------------------------------------------------------
 *
 * After you've added the Tiled plugin you may want to start creating your
 * Tiled maps. Make sure you make these maps in your game folder, so that any
 * direct references to images will work right off the box.
 *
 * The first thing you'll need to do is to create a map inside RPG Maker MV.
 * By default, you'll already have a map with map ID 1, so when you start off,
 * you can just use that map. Now, create a new map in Tiled. Make sure its
 * orientation is Orthogonal, and the map is saved as a comma separated value
 * (CSV).
 *
 * Next, save your map as a json file. Call it Map, followed by the ID, but not
 * zero padded. For example, if your map ID is 1, save your Tiled map as
 * Map1.json. Make sure you directly save it in the folder you defined in your
 * plugin settings (Maps Location). And with that, you've set up your first
 * map in Tiled.
 *
 * ----------------------------------------------------------------------------
 * - Infinite maps vs. fixed size maps                                        -
 * ----------------------------------------------------------------------------
 *
 * Tiled has two types of maps, infinite maps and fixed size maps. They are
 * essentially similar in use, with one difference, which is that infinite maps
 * don't have a fixed size. In the Tiled plugin, both maps are treated the
 * same, though, with infinite maps having their size determined by the
 * sizes defined inside the Tiled map format.
 *
 * This means that infinite maps may appear smaller or cut off than what they
 * are supposed to look like. To fix this, you could preset the sizes by
 * manually setting the size. Your map will remain an infinite map, but you'll
 * now have a bit more flexibility with how the map is shaped in the final
 * product.
 *
 * It's still recommended to convert infinite maps to fixed size maps, as the
 * pre-processing phase will be skipped, allowing for faster map loading.
 *
 * ----------------------------------------------------------------------------
 * - Layers                                                                   -
 * ----------------------------------------------------------------------------
 *
 * Like stated before, with this plugin you can use practically unlimited
 * layers. By default, a layer has no z-index, which means it'll always be at
 * the bottom, or stacked on top of other layers and objects with no z-index.
 *
 * ----------------------------------------------------------------------------
 * - Tilesets                                                                 -
 * ----------------------------------------------------------------------------
 *
 * By default, RPG Maker MV tilesets won't work in Tiled, since autotiles
 * aren't implemented. However, there is a tool that can convert RPG Maker MV
 * tilesets so that it can be used in Tiled, called Remex.
 *
 * https://app.assembla.com/spaces/rpg-maker-to-tiled-suite/subversion/source
 *
 * When importing tilesets, you have the option of embedding the tileset data
 * inside the map itself, or saving it in a separate file. Make sure that when
 * you do the latter, you'll have to save it as a json file, and you'll have to
 * put it in the folder specified in the plugin configuration, under
 * Tilesets Location.
 *
 * ----------------------------------------------------------------------------
 * - Events                                                                   -
 * ----------------------------------------------------------------------------
 *
 *
 * ----------------------------------------------------------------------------
 * - Extra notes on parallax images                                           -
 * ----------------------------------------------------------------------------
 *
 * While the Tiled plugin has its own handles for parallax images, you can
 * still use RPG Maker MV's default parallax image functionality, as that will
 * not be overwritten. This is to give the creators options, in case the Tiled
 * functionalities are too confusing.
 *
 *
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
 * ----------------------------------------------------------------------------
 * - For plugin developers                                                    -
 * -   * Extra notes by Gary Kertopermono a.k.a. GaryCXJk                     -
 * ----------------------------------------------------------------------------
 * 
 * There are now hooks for plugin developers, so that they could add their own
 * plugin hooks.
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
