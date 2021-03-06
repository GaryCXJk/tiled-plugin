/******************************************************************************
 * YED_Tiled.js                                                               *
 ******************************************************************************
 * Tiled Plugin v2.03                                                         *
 * By Archeia and Dr. Yami                                                    *
 ******************************************************************************
 * License: Custom                                                            *
 ******************************************************************************
 * You are free to use this plugin for your own project, both in commercial   *
 * as well as non-commercial projects, free of charge. Do not claim this      *
 * plugin as your own.                                                        *
 ******************************************************************************/

/*:
 * @plugindesc v2.03 Plugin supports Tiled Map Editor maps with some additional
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
 * @param Custom Data
 * 
 * @param Custom Tile Flags
 * @parent Custom Data
 * @desc Set custom tile flags here.
 * @type text[]
 * 
 * @param Custom Vehicles
 * @parent Custom Data
 * @desc Set custom vehicles here.
 * @type struct<Vehicle>[]
 *
 * @help
 *
 * ================================================================================
 * = Introduction                                                                 =
 * ================================================================================
 * 
 *  * Tired of RPG Maker MV's Map Editor?
 *  * Do you want to map the XP way but more?
 *  * Tired of Parallax Mapping?
 *  * Want to do round corners?
 *  * Want to create a map with basically unlimited layers?
 * 
 * Well, now all those worries are gone! Instead, let's just use the awesome
 * map editor, Tiled! Free, easy to use and very flexible Map Editor. This is
 * one of our reveals for RMMV's release but due to unforeseen circumstances,
 * we were unable to showcase this really awesome plugin in RPG Maker Channel.
 * 
 * -- Archeia and Dr. Yami
 * 
 * Tiled is a separate application developed by Bjorn, and you can find it
 * here:
 * 
 * http://www.mapeditor.org/
 * 
 * ================================================================================
 * = Usage                                                                        =
 * ================================================================================
 * 
 * Just put this script as high as possible, preferably before plugins that
 * extend functionality of maps and rendering thereof, but after any plugin
 * that rewrites map handling. Ideally, you'd only have to use this plugin for
 * any of your mapping needs.
 * 
 * Note that the Tiled plugin handles the following:
 *  * Map layouts and rendering
 *  * Regions
 *  * Collisions
 *  * Parallax images
 * 
 * Note that this guide won't explain how to use Tiled itself, this will only
 * go over the plugin specific features.
 * 
 * --------------------------------------------------------------------------------
 * - Starting your project                                                        -
 * --------------------------------------------------------------------------------
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
 * --------------------------------------------------------------------------------
 * - Infinite maps vs. fixed size maps                                            -
 * --------------------------------------------------------------------------------
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
 * You could also enable auto-sizing or even auto-cropping, which will reduce
 * the size of the map to that of the smallest area that's been covered by tiles.
 * This feature will ignore images, as the size of these images can only
 * determined after they've been loaded, and during the pre-processing phase,
 * this hasn't happened yet. To enable this, add the property autoSize to the map
 * properties. If set, the map will auto-size down to the smallest size of all
 * chunks combined. Most of the time, a chunk is 16x16 tiles big, so you might
 * end up with a lot of empty space.
 * 
 * If you set autoSize to "deep" or "crop" (both have exactly the same effect),
 * it will crop the map to the smallest size possible, by cutting away empty
 * space.
 * 
 * If you still need some space around your map, you can do so by adding a border.
 * This border is set by adding a property to the map called border. By default,
 * it adds a border all around the map of equal width, however, if you set the
 * type to string, you can set four values, separated by spaces. The borders are
 * defined in the order top, right, bottom and left.
 * 
 * It's still recommended to convert infinite maps to fixed size maps, as the
 * pre-processing phase will be skipped, allowing for faster map loading.
 * 
 * --------------------------------------------------------------------------------
 * - Layers                                                                       -
 * --------------------------------------------------------------------------------
 * 
 * Like stated before, with this plugin you can use practically unlimited
 * layers. By default, a layer has no z-index, which means it'll always be at
 * the bottom, or stacked on top of other layers and objects with no z-index.
 * You can also specify a custom z-index by adding a property zIndex. If the
 * z-index is lower than that of the player, it will render below the player,
 * if the z-index is higher than the player, though, it will render above.
 * 
 * --------------------------------------------------------------------------------
 * - Tilesets                                                                     -
 * --------------------------------------------------------------------------------
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
 * --------------------------------------------------------------------------------
 * - Events                                                                       -
 * --------------------------------------------------------------------------------
 * 
 * Setting up events is easy, although it does require you to actually still use
 * RPG Maker MV, as you'll be setting up your events here. Like maps, each event
 * has its own ID. To retrieve its ID, you'll have to select your event, and in
 * the bottom right corner of the RPG Maker MV editor, you'll see the event ID as
 * well as its name, for example, 001:EV001.
 * 
 * Next, you'll need to create a new object in Tiled. Create a new Object layer,
 * and create a new rectangular object. You could in theory use a different shape,
 * but since events generally are rectangular, you want to make sure your object
 * is the same shape as a tile. Also, if Constrain Events to Grid is set to true,
 * the objects will automatically snap to the grid, so, if you don't want your
 * event to appear somewhere you didn't intend it to be, make sure you snap to
 * grid.
 * 
 * Now, to make it all work, all you need to do is give this object a property
 * eventId and set the event ID as the value. This will move the event to the
 * proper map location.
 * 
 * --------------------------------------------------------------------------------
 * - Vehicles                                                                     -
 * --------------------------------------------------------------------------------
 * 
 * You can add vehicles in the same way as events, except you don't have to place
 * the vehicle in your map. This is because vehicles already are on every map.
 * 
 * To place a vehicle in your map, use the object property vehicle, and set as
 * the value the name of the vehicle you want to add. You can use "boat", "ship"
 * or "airship", or any custom made vehicle you have made through plugins.
 * 
 * --------------------------------------------------------------------------------
 * - Images                                                                       -
 * --------------------------------------------------------------------------------
 * 
 * Images can now directly be added to Tiled, both as parallax images as well as
 * regular images. By default, images added through Tiled will act like regular
 * images, and will be placed in the layer order you've set in the Tiled map.
 * However, you can add several properties to make images a bit more dynamic. For
 * example, you can use the same hide functions as for regular layers.
 * 
 * The main feature for images that most would want to use though is parallax
 * images. To set an image as a parallax, you can set the repeatX and repeatY to
 * true, so that the image will tile. You can also set a custom scroll speed when
 * the camera is moving by changing the deltaX and deltaY. A delta of 0 means that
 * the image stays stationary on that axis, while a delta of 1 makes the image
 * scroll with the same speed as the player.
 * 
 * As an added feature, you can define a viewport. What it does is it allows you
 * to add essentially a smaller window in which the image is rendered. Anything
 * that falls outside this viewport will be cut off. You can set a viewport by
 * using viewportX, viewportY, viewportWidth and viewportHeight, and you can also
 * give the viewports their own delta with viewportDeltaX and viewportDeltaY.
 * 
 * --------------------------------------------------------------------------------
 * - Extra notes on parallax images                                               -
 * --------------------------------------------------------------------------------
 * 
 * While the Tiled plugin has its own handles for parallax images, you can
 * still use RPG Maker MV's default parallax image functionality, as that will
 * not be overwritten. This is to give the creators options, in case the Tiled
 * functionalities are too confusing.
 * 
 * ================================================================================
 * = Properties                                                                   =
 * ================================================================================
 * 
 * As explained earlier, several elements in Tiled can have properties that will
 * interface with the Tiled Plugin.
 * 
 * --------------------------------------------------------------------------------
 * - Tile layer properties                                                        -
 * --------------------------------------------------------------------------------
 * 
 *   zIndex
 * The layer will have z-index equal to the property's value.
 * 
 *   collision
 * The layer will be a collision mask layer. Use one of these value:
 * 
 *  * full - Normal collision (1 full-tile)
 *  * arrow - Arrow collision
 *  * up-left - Half-tile collision up-left quarter
 *  * up-right - Half-tile collision up-right quarter
 *  * down-left - Half-tile collision down-left quarter
 *  * down-right - Half-tile collision down-right quarter
 *  * tiles - Collision is determined by the tileset
 * 
 *   arrowImpassable
 * If the layer is an arraw collision mask layer, it will make one direction be
 * impassable. Value can be up, down, left or right.
 * 
 *   regionId
 * Mark the layer as region layer, the layer ID will be the value of property.
 * If set to -1, it will use the tileset to determine the region ID.
 * 
 *   priority
 * Mark the layer as priority layer, allows it goes above player when player is
 * behind, below player when player is in front of. Value should be greater than
 * 0, zIndex should be the same as player z-index.
 * 
 * Note that this also determines the drawing priority, e.g. layers with the
 * same z-index and y-position would then be sorted by their priority.
 * 
 *   level
 * Mark the layer on different a level, use for multiple levels map (for example
 * a bridge). Default level is 0. Use this for collision and regionId.
 * 
 *   toLevel
 * The tiles on this layer will transfer the player to another level.
 * 
 *   tileFlags
 * Set this to true to enable tile flags in the tileset. Set this to "hide" if you
 * aren't going to draw this layer.
 * 
 *   hideOnLevel
 * Hide the layer when on a certain level.
 * 
 *   showOnLevel
 * Show the layer when on a certain level.
 * 
 *   hideOnRegion
 * Hide the layer when on a certain region.
 * 
 *   hideOnRegions
 * Hide the layer when on a certain region. This takes an array of possible
 * regions, and the player only needs to be on one of the layers. Each region is
 * comma separated.
 * 
 *   hideOnAnyRegions
 * Hide the layer when on a certain region. This functions the same as
 * hideOnRegions, except it will take all regions on that tile instead of just
 * the top visible region.
 * 
 *   hideOnSwitch
 * Hide the layer when a certain switch is set.
 * 
 *   showOnSwitch
 * Show the layer when a certain switch is set.
 * 
 *   transition
 * This will enable the layer to transition from a shown state to a hidden state.
 * Set the value as the duration in ticks.
 * 
 *   minimumOpacity
 * The minimum opacity the layer should fade out to.
 * 
 * --------------------------------------------------------------------------------
 * - Tileset properties                                                           -
 * --------------------------------------------------------------------------------
 * 
 *   ignoreLoading
 * Ignores the image, and doesn't load nor render it. Good if you want to mark
 * certain areas in Tiled for development purposes or mapping notes, but don't
 * want them to appear in the game.
 * 
 * --------------------------------------------------------------------------------
 * - Tile properties                                                              -
 * --------------------------------------------------------------------------------
 * 
 *   regionId
 * Mark the tile as region, the tile's region ID will be the value of property
 * 
 *   collision
 * Mark the tile as having normal collision (1 full-tile)
 * 
 *   collisionUpLeft
 * Mark the tile as having half-tile collision up-left quarter
 * 
 *   collisionUpRight
 * Mark the tile as having half-tile collision up-right quarter
 * 
 *   collisionDownLeft
 * Mark the tile as having half-tile collision down-left quarter
 * 
 *   collisionDownRight
 * Mark the tile as having half-tile collision down-right quarter
 * 
 * collisionUpLeft, collisionUpRight, collisionDownLeft and collisionDownRight can
 * be combined to create a custom collision.
 * 
 *   arrowImpassableLeft
 * Make the left direction impassable
 * 
 *   arrowImpassableUp
 * Make the up direction impassable
 * 
 *   arrowImpassableRight
 * Make the right direction impassable
 * 
 *   arrowImpassableDown
 * Make the down direction impassable
 * 
 * arrowImpassableLeft, arrowImpassableUp, arrowImpassableRight and
 * arrowImpassableDown can be combined to create a custom arrow passability.
 * 
 *   flagIsBoat
 * The tile is passable by boat
 * 
 *   flagIsShip
 * The tile is passable by ship
 * 
 *   flagIsAirship
 * The tile is landable by airship
 * 
 *   flagIsLadder
 * The tile is a ladder
 * 
 *   flagIsBush
 * The tile is a bush or has special bush rendering
 * 
 *   flagIsCounter
 * The tile is a counter (can interact through this tile with another event)
 * 
 *   flagIsDamage
 * The tile is a damage tile (player gets damaged when stepped on)
 * 
 *   flagIsIce
 * The tile is slippery
 * 
 * **battleback1Name**
 * The file name of the battle background that should be used here
 * 
 * **battleback2Name**
 * The file name of the battle background that should be used here
 * 
 * --------------------------------------------------------------------------------
 * - Object properties                                                            -
 * --------------------------------------------------------------------------------
 * 
 *   eventId
 * The event ID that should be placed at this position.
 * 
 *   vehicle
 * The vehicle that should be placed at this position.
 * 
 * **waypoint**
 * The name of a waypoint. This can be used to determine a position on the map
 * without having to rely on coordinates.
 * 
 * --------------------------------------------------------------------------------
 * - Image properties                                                             -
 * --------------------------------------------------------------------------------
 * 
 *   ignoreLoading
 * Ignores the image, and doesn't load nor render it. Good if you want to mark
 * certain areas in Tiled for development purposes or mapping notes, but don't
 * want them to appear in the game.
 * 
 *   zIndex
 * The image will have z-index equal to the property's value.
 * 
 *   repeatX
 * Whether it has to repeat horizontally or not.
 * 
 * **repeatY**
 * Whether it has to repeat vertically or not.
 * 
 *   deltaX
 * The horizontal movement when the camera moves.
 * 
 *   deltaY
 * The vertical movement when the camera moves.
 * 
 *   autoX
 * Setting this will automatically move the image, depending on the value, in
 * the horizontal direction.
 * 
 *   autoY
 * Setting this will automatically move the image, depending on the value, in
 * the vertical direction.
 * 
 *   viewportX
 * The x-coordinate of the viewport.
 * 
 *   viewportY
 * The y-coordinate of the viewport.
 * 
 *   viewportWidth
 * The width of the viewport.
 * 
 *   viewportHeight
 * The height of the viewport.
 * 
 *   viewportDeltaX
 * The horizontal movement of the viewport when the camera moves.
 * 
 *   viewportDeltaY
 * The vertical movement of the viewport when the camera moves.
 * 
 *   hue
 * The hue of the image.
 * 
 *   hideOnLevel
 * Hide the layer when on a certain level.
 * 
 *   showOnLevel
 * Show the layer when on a certain level.
 * 
 *   hideOnRegion
 * Hide the layer when on a certain region.
 * 
 *   hideOnRegions
 * Hide the layer when on a certain region. This takes an array of possible
 * regions, and the player only needs to be on one of the layers. Each region is
 * comma separated.
 * 
 *   hideOnAnyRegions
 * Hide the layer when on a certain region. This functions the same as
 * hideOnRegions, except it will take all regions on that tile instead of just
 * the top visible region.
 * 
 *   hideOnSwitch
 * Hide the layer when a certain switch is set.
 * 
 *   showOnSwitch
 * Show the layer when a certain switch is set.
 * 
 *   transition
 * This will enable the layer to transition from a shown state to a hidden state.
 * Set the value as the duration in ticks.
 * 
 *   minimumOpacity
 * The minimum opacity the layer should fade out to.
 * 
 * ================================================================================
 * = Development hooks                                                            =
 * ================================================================================
 * 
 * For the Tiled Plugin, several hooks have been created for plugin developers,
 * so that they could create their own plugin for Tiled without having to
 * overwrite functionality.
 * 
 * TiledManager.addListener(objectName, event, callback, recursive = true)
 * -----------------------------------------------------------------------
 * 
 * Adds a listener for certain events.
 * 
 *   objectName
 * The name of the object this listener is meant for, for example,
 * Game_CharacterBase or Game_Player.
 * 
 *   event
 * The name of the event it should listen to.
 * 
 *   callback
 * The callback function. This callback function takes exactly one argument,
 * as the listener will pass an object to this callback.
 * 
 *   recursive
 * Whether the event callback will be triggered recursively. If an object is
 * derived from another object, like Game_Player being derived from
 * Game_CharacterBase, by default it will also call the callbacks from that
 * object. When set to false, it will skip the current callback if it's not
 * directly applied to that object.
 * 
 * TiledManager.triggerListener(object, event, options = {})
 * ---------------------------------------------------------
 * 
 * This triggers an event for a certain object.
 * 
 *   object
 * Generally the keyword "this", but you can set any object for which the
 * callbacks should be called.
 * 
 *   event
 * The name of the event. that should be called.
 * 
 *   options
 * An object that contains properties that can be passed on to the callback.
 * 
 * TiledManager.addHideFunction(id, callback, ignore = [])
 * -------------------------------------------------------
 * 
 * Adds a hide function, a function that hides a layer or image based on
 * certain rules.
 * 
 *   id
 * The ID of the hide function. This will also be used as a property check
 * for Tiled maps itself. If there isn't a property of the same name as the
 * ID, it will not execute the callback.
 * 
 *   callback
 * The callback function that should be run. This should return true if a
 * layer or image has to be hidden, and false if it should remain visible.
 * 
 *   ignore
 * This is mainly used during calculations, and can be left empty. Essentially
 * you can add groups that should ignore this function. These groups are:
 * 
 *  * regions
 *  * collisions
 *  * levelChanges
 *  * tileFlags
 * 
 * The only thing it does is making sure functions and methods that belong to
 * a certain group will ignore this callback.
 * 
 * TiledManager.checkLayerHidden(layerData, ignore = [])
 * -----------------------------------------------------
 * 
 * This will check if a certain layer is hidden.
 * 
 *   layerData
 * The Tiled layer data. Note that this isn't the properties data, but the
 * entire layer data.
 * 
 *   ignore
 * You can specify here which hide functions it should ignore, as specified in
 * TiledManager.addHideFunction.
 * 
 * TiledManager.hasHideProperties(layerData)
 * -----------------------------------------
 * 
 * Checks whether a layer has hide properties.
 * 
 *   layerData
 * The Tiled layer data. Note that this isn't the properties data, but the
 * entire layer data.
 * 
 * TiledManager.addFlag(...flagIds)
 * --------------------------------
 * 
 * Adds a flag or multiple flags.
 * 
 *   flagIds
 * The flag ID you want to add. You can just set multiple of them as multiple
 * arguments. The flag IDs will be used to check up which bit you need to check,
 * as well as in the tile property. When setting a tile property using this
 * flag ID, prepend it with "flagIs" and capitalize the first letter. For
 * example, if you have a flag ID "monster", you'll use the property
 * "flagIsMonster".
 * 
 * TiledManager.getFlag(flagId)
 * ----------------------------
 * 
 * Get the numerical ID of a certain flag.
 * 
 *   flagId
 * The flag ID.
 * 
 * TiledManager.getFlagNames()
 * ---------------------------
 * 
 * Get a list of all flags.
 * 
 * TiledManager.getFlagLocation(flagId)
 * ------------------------------------
 * 
 * Get an array with the values group and bit. The group is the group in which
 * the flag bit resides, and the bit is the bit number of that group.
 * 
 *   flagId
 * The flag ID.
 * 
 * TiledManager.createVehicle(vehicleName, vehicleData = false)
 * ------------------------------------------------------------
 * 
 *   vehicleName
 * The name of the vehicle.
 * 
 *   vehicleData
 * An object containing the vehicle data. When false, it will take default
 * values, otherwise, it will take an object. This object has essentially
 * the same structure as the vehicles inside the System.json file. On top
 * of that, there are a few extra properties.
 * 
 *     moveSpeed  
 * The move speed of the vehicle.
 * 
 *     direction  
 * The initial direction of the vehicle.
 * 
 *     tileFlag  
 * The tile flag it looks for when looking for passability.
 * 
 *     hasCollision  
 * Whether the vehicle has collision. When false, you'll have to stand on
 * top of it to enter.
 * 
 *     resetDirection  
 * Whether the vehicle has to reset its direction after you exit it.
 * 
 * --------------------------------------------------------------------------------
 * - Objects and events                                                           -
 * --------------------------------------------------------------------------------
 * 
 * These are the objects and their events. Note that events are inherited by
 * underlying objects, for example, Game_Character inherits all events from
 * Game_CharacterBase.
 * 
 * All elements will pass an object with several properties, which you can
 * use in your own events.
 * 
 * Game_CharacterBase
 * ===================
 * 
 *   stopmovement
 * Triggers when movement is stopped.
 * 
 *     direction  
 * The direction the character is looking in.
 * 
 *   slipperyfloor
 * Triggers when stepping on a slippery floor tile.
 * 
 *     direction  
 * The direction the character is looking in.
 * 
 * Game_Player
 * ============
 * 
 *   changelevel
 * Triggers when changing layer levels.
 * 
 * oldLevel
 * --------
 * The old level.
 * 
 * newLevel
 * --------
 * The new level.
 * 
 * Game_Map
 * =========
 * 
 *   changelevel
 * Triggers when changing layer levels.
 * 
 * oldLevel
 * --------
 * The old level.
 * 
 * newLevel
 * --------
 * The new level.
 * 
 * TiledManager
 * ============
 * These are events that are triggered by the TiledManager.  Subscribe to them by adding a listener to the TiledManager
 * 
 *   tiledlayerdataprocessed
 * Triggers when a tiled layer has been loaded and unencoded.  Can be useful
 * to manipulate information on the layer before it gets rendered.
 * 
 * layer
 * -----
 * The layer that just finished processing.
 * 
 * parentLayer
 * -----------
 * The tiled layer that is the parent of this layer (such as a group parent)
 * 
 *   tiledmapdataprocessed
 * Triggers when all the layers have been processed.  Can be useful to manipulate the
 * map data before it gets rendered.
 * 
 * mapData
 * -------
 * The entire map data with all layers processed.
 * 
 * mapId
 * -----
 * The map Id of the map that was loaded.
 * 
 * --------------------------------------------------------------------------------
 * - Tiled Object Resolvers                                                       -
 * --------------------------------------------------------------------------------
 * 
 * Within Tiled, you can add objects that contain properties.  Having the ability to
 * intercept these objects and perform actions on the map while it's being loaded is
 * exposed through `Object Resolvers`.
 * 
 * These object resolvers are simply functions that are called whenever an object
 * is processed on the map.  The functions must follow the form:
 * 
 * ```javascript
 * function (tiledObject, map) {
 * return true | false;
 * --------------------
 * }
 * ```
 * 
 * All registered object resolver will be called for each object encountered, but if
 * one of the resolvers returns `true` then no more resolvers will be called for that
 * object.
 * 
 * Object resolvers are registered by calling:
 * 
 * ```javascript
 * // Add new resolvers to the TiledManager.objectResolvers
 * TiledManager.objectResolvers.eventRandomizer = function(object, map) {
 * if (object.type === "eventRandomizer") {
 * ----------------------------------------
 *         if (Math.random() * 100 > 50) {
 * object.properties.eventId = object.properties.event1;
 * -----------------------------------------------------
 *         } else {
 * object.properties.eventId = object.properties.event2;
 * -----------------------------------------------------
 *         }
 * 
 * // We assigned an event Id that corresponds to an
 * -------------------------------------------------
 *         // event on the map, now we can call the eventId
 * // resolver to map the event to this object
 * -------------------------------------------
 *         TiledManager.objectResolvers.eventId(object);
 * return true;
 * ------------
 *     }
 * 
 * // not my object, continue processing
 * -------------------------------------
 *     return false;
 * }
 * 
 * TiledManager.registerObjectResolver(
 * TiledManager.objectResolvers.eventRandomizer
 * --------------------------------------------
 * );
 * ```
 * 
 * The following object resolvers are pre-registered and will run before any custom
 * resolvers:
 * 
 * * waypoint - processes waypoints
 * * eventId - maps an existing event to the object location
 * * vehicle - processes vehicles
 * ================================================================================
 * = Changes                                                                      =
 * ================================================================================
 * 
 * **v2.03 (2020-03-31)**
 * * Fix: There seemed to be a WebGL issue
 * 
 * **v2.02 (2018-05-03)**
 * Author: Frilly Wumpus
 * 
 * * Added: new event hook for intercepting when each tiled data layer has finished
 *   processing/unencoding
 * * Added: new event hook for intercepting once the entire tiled data map has
 *   been processed
 * * Added: new ObjectResolver functions to be able to define and
 *   process custom Tiled objects.
 * * Fix: Updated `triggerListener` to work with static classes like
 *   the TileManager
 * 
 *   v2.01 (2018-04-13)
 * * Fix: Crash when using TiledTransferPlayer while using a text string to
 *   determine the fade type  
 *   Credits to: FrillyWumpus
 * 
 * **v2.00 (2018-02-26)**
 * * Initial build for v2.00
 * * Added: Support for Tiled v1.1.x
 * * Added: Custom collision handling
 * * Added: Opacity of layers
 * * Added: Images and parallax effects
 * * Added: Object tiles
 * * Added: Flipping and mirroring of object tiles
 * * Added: Basic support for event hooks
 * * Added: Support for infinite maps
 * * Added: Support for base64 encoded maps
 * 
 * **v1.10**
 * * Initial version
 *
 */
/*~struct~Vehicle:
 * @param vehicleName
 * @text Vehicle Name
 * @desc A name for the vehicle to identify this vehicle.
 * 
 * @param characterName
 * @text Character Image File Name
 * @desc The image used for the vehicle.
 * @type file
 * @dir img/characters/
 * @requre 1
 * 
 * @param characterIndex
 * @text Character Image Index
 * @desc The index used for the character image.
 * @type number
 * @min 0
 * @max 7
 * @default 0
 * 
 * @param bgm
 * @text Background Music
 * @type struct<Bgm>
 * @default {"name":"","pan":"0","pitch":"0","volume":"0"}
 * 
 * @param moveSpeed
 * @text Move Speed
 * @desc The move speed for this vehicle.
 * @type number
 * @min 1
 * @default 4
 * 
 * @param direction
 * @text Initial Direction
 * @desc The initial direction of the vehicle, and the direction the vehicle will be set to when reset.
 * @type select
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 4
 * 
 * @param tileFlag
 * @text Tile Flag Passability
 * @desc The tile flag used to check the passability of this vehicle. Leave blank to have no tile restrictions.
 * 
 * @param hasCollision
 * @text Has Collision
 * @desc Whether the vehicle has collision detection from other entities.
 * @type boolean
 * @default true
 * 
 * @param resetDirection
 * @text Reset Direction
 * @desc Whether the vehicle direction has to be reset when exiting.
 * @type boolean
 * @default true
 */
/*~struct~Bgm:
 * @param name
 * @text Song Name
 * @desc The song name used.
 * @type file
 * @dir audio/bgm/
 * @require 1
 * 
 * @param pan
 * @text Pan
 * @type number
 * 
 * @param pitch
 * @text Pitch
 * @type number
 * 
 * @param volume
 * @text Volume
 * @type number
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/AlphaFilter.js":
/*!****************************!*\
  !*** ./src/AlphaFilter.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/* A fallback implementation of AlphaFilter */
var fragmentSrc = 'varying vec2 vTextureCoord;' + 'uniform sampler2D uSampler;' + 'uniform float uAlpha;' + 'void main(void)' + '{' + '   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;' + '}';

if (!PIXI.filters.AlphaFilter) {
  var AlphaFilter = /*#__PURE__*/function (_PIXI$Filter) {
    _inherits(AlphaFilter, _PIXI$Filter);

    var _super = _createSuper(AlphaFilter);

    /**
     * @param {number} [alpha=1] Amount of alpha from 0 to 1, where 0 is transparent
     */
    function AlphaFilter() {
      var _this;

      var alpha = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;

      _classCallCheck(this, AlphaFilter);

      _this = _super.call(this, // vertex shader
      null, // fragment shader
      fragmentSrc);
      _this.alpha = alpha;
      _this.glShaderKey = 'alpha';
      return _this;
    }
    /**
     * Coefficient for alpha multiplication
     *
     * @member {number}
     * @default 1
     */


    _createClass(AlphaFilter, [{
      key: "alpha",
      get: function get() {
        return this.uniforms.uAlpha;
      },
      set: function set(value) // eslint-disable-line require-jsdoc
      {
        this.uniforms.uAlpha = value;
      }
    }]);

    return AlphaFilter;
  }(PIXI.Filter);

  PIXI.filters.AlphaFilter = AlphaFilter;
}

/***/ }),

/***/ "./src/DataManager.js":
/*!****************************!*\
  !*** ./src/DataManager.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

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
  xhr.overrideMimeType('application/json'); // on success callback

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var idx;

      (function () {
        if (xhr.status === 200 || xhr.responseText !== "") {
          DataManager._tempTiledData = JSON.parse(xhr.responseText);
          TiledManager.processTiledData(DataManager._tempTiledData);
          TiledManager.triggerListener(TiledManager, "tiledmapdataprocessed", DataManager._tempTiledData, mapId);
        }

        var tiledLoaded = true;
        var tilesRequired = 0;

        if (DataManager._tempTiledData && DataManager._tempTiledData.tilesets && DataManager._tempTiledData.tilesets.length > 0) {
          var _loop = function _loop() {
            var tileset = DataManager._tempTiledData.tilesets[idx];

            if (tileset.source) {
              var realTileset = TilesetManager.getTileset(tileset.source);

              if (realTileset) {
                DataManager._tempTiledData.tilesets[idx] = Object.assign({}, realTileset, {
                  firstgid: DataManager._tempTiledData.tilesets[idx].firstgid
                });
              } else {
                tiledLoaded = false;
                tilesRequired++;
                +function (idx) {
                  TilesetManager.loadTileset(tileset.source, function (returnTileset) {
                    DataManager._tempTiledData.tilesets[idx] = Object.assign({}, returnTileset, {
                      firstgid: DataManager._tempTiledData.tilesets[idx].firstgid
                    });
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
  }; // set data to null and send request


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

/***/ "./src/Game_Actor.js":
/*!***************************!*\
  !*** ./src/Game_Actor.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Constants
var pluginParams = PluginManager.parameters("YED_Tiled");
var _checkFloorEffect = Game_Actor.prototype.checkFloorEffect;

Game_Actor.prototype.checkFloorEffect = function () {
  _checkFloorEffect.call(this);

  if ($gamePlayer.isOnHealFloor()) {
    this.executeFloorHeal();
  }
};

Game_Actor.prototype.executeFloorHeal = function () {
  var heal = Math.floor(this.basicFloorHeal() * this.fdr);
  heal = Math.min(heal, this.maxFloorHeal());
  this.gainHp(heal);

  if (heal > 0) {
    this.performMapHeal();
  }
};

Game_Actor.prototype._getFloorHPCalculation = function () {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'damage';
  var typeName = type.slice(0, 1).toUpperCase() + type.slice(1).toLowerCase();
  var floorHP = [];

  for (var layerId = 0; layerId < $gameMap.tiledData.layers; layerId++) {
    var layerData = $gameMap.tiledData.layers[layerId];

    if (!layerData.properties) {
      return;
    }

    var level = parseInt(layerData.properties.level) || 0;

    if (level !== $gameMap.currentMapLevel) {
      return;
    }

    if (TiledManager.checkLayerHidden(layerData)) {
      return;
    }

    var tile = Game_Map.prototype.getTileProperties(x, y, layerId);

    if (!!tile.properties && !!tile.properties['floor' + typeName]) {
      floorHP.push(layerData.properties['floor' + typeName]);
    }
  }

  var actualHP = 0;

  switch ((pluginParams["Floor HP Calculation"] || '').toLowerCase()) {
    case 'sum':
      floorHP.forEach(function (hp) {
        actualHP += hp;
      });
      break;

    case 'average':
      floorHP.forEach(function (hp) {
        actualHP += hp;
      });
      actualHP = Math.round(actualHP / floorHP.length);
      break;

    case 'top':
    default:
      actualHP = floorHP.pop();
      break;
  }

  return actualHP;
};

Game_Actor.prototype.basicFloorDamage = function () {
  var actualDamage = this._getFloorHPCalculation('damage');

  return actualDamage || parseInt(pluginParams["Basic Floor Damage"]) || 10;
};

Game_Actor.prototype.basicFloorHeal = function () {
  var actualHeal = this._getFloorHPCalculation('heal');

  return actualHeal || parseInt(pluginParams["Basic Floor Heal"]) || 10;
};

Game_Actor.prototype.maxFloorHeal = function () {
  return Math.max(this.mhp - this.hp, 0);
};

Game_Actor.prototype.performMapHeal = function () {
  if (!$gameParty.inBattle()) {
    $gameScreen.startFlashForHeal();
  }
};

/***/ }),

/***/ "./src/Game_CharacterBase.js":
/*!***********************************!*\
  !*** ./src/Game_CharacterBase.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

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
  if (!this.hasOwnProperty('_bushDepth')) {
    this._bushDepth = 0;
  }

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

  if (!this.isMoving()) {
    TiledManager.triggerListener(this, 'stopmovement', {
      direction: d
    });

    if ($gameMap.isSlipperyFloor(this._x, this._y)) {
      TiledManager.triggerListener(this, 'slipperyfloor', {
        direction: d
      });
    }
  }
};

Game_CharacterBase.prototype.locationHeight = function () {
  return this._locationHeight || 0;
};

var _isCollideWithVehicles = Game_CharacterBase.prototype.isCollidedWithVehicles;

Game_CharacterBase.prototype.isCollidedWithVehicles = function (x, y) {
  if (!_isCollideWithVehicles.call(this, x, y)) {
    var vehicles = $gameMap.vehicles();

    for (var i = 0; i < vehicles.length; i++) {
      if (!(vehicles[i].vehicleData && (!vehicles[i].vehicleData.hasOwnProperty('hasCollision') || vehicles[i].vehicleData.hasCollision === 'true' || vehicles[i].vehicleData.hasCollision === true)) || vehicles[i].posNt(x, y)) {
        return true;
      }
    }

    return false;
  }

  return true;
};

Game_CharacterBase.prototype.updateScroll = function (lastScrolledX, lastScrolledY) {
  var x1 = lastScrolledX;
  var y1 = lastScrolledY;
  var x2 = this.scrolledX();
  var y2 = this.scrolledY();

  if (y2 > y1 && y2 > this.centerY()) {
    $gameMap.scrollDown(y2 - y1);
  }

  if (x2 < x1 && x2 < this.centerX()) {
    $gameMap.scrollLeft(x1 - x2);
  }

  if (x2 > x1 && x2 > this.centerX()) {
    $gameMap.scrollRight(x2 - x1);
  }

  if (y2 < y1 && y2 < this.centerY()) {
    $gameMap.scrollUp(y1 - y2);
  }
};

/***/ }),

/***/ "./src/Game_Interpreter.js":
/*!*********************************!*\
  !*** ./src/Game_Interpreter.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var _pluginCommand = Game_Interpreter.prototype.pluginCommand;

Game_Interpreter.prototype.pluginCommand = function (command, args) {
  _pluginCommand.call(this, command, args);

  TiledManager.pluginCommand.call(this, command, args);
};

/***/ }),

/***/ "./src/Game_Map.js":
/*!*************************!*\
  !*** ./src/Game_Map.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TiledMap_TiledMapImage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TiledMap/TiledMapImage */ "./src/TiledMap/TiledMapImage.js");
/* harmony import */ var _TiledMap_TiledMapLayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TiledMap/TiledMapLayer */ "./src/TiledMap/TiledMapLayer.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }


 // Constants

var pluginParams = PluginManager.parameters("YED_Tiled");
Object.defineProperty(Game_Map.prototype, 'tiledData', {
  get: function get() {
    return DataManager._tempTiledData;
  },
  configurable: true
});
Object.defineProperty(Game_Map.prototype, 'currentMapLevel', {
  get: function get() {
    var varID = parseInt(pluginParams["Map Level Variable"]);

    if (!varID) {
      return this._currentMapLevel;
    } else {
      return $gameVariables.value(varID);
    }
  },
  set: function set(value) {
    var varID = parseInt(pluginParams["Map Level Variable"]);

    if (!varID) {
      this._currentMapLevel = value;
    } else {
      $gameVariables.setValue(varID, value);
    }
  },
  configurable: true
});
Object.defineProperty(Game_Map.prototype, 'layers', {
  get: function get() {
    return this._layers;
  }
});
var _setup = Game_Map.prototype.setup;

Game_Map.prototype.setup = function (mapId) {
  this._tiledInitialized = false;
  this._layers = [];
  this._levels = [];
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
  this._waypoints = {};
  this._layerProperties = [];
  this._camera = {
    focus: "player",
    data: null
  };

  _setup.call(this, mapId);

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
  } else {
    this._tiledInitialized = true;
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
  this._setupLayers();

  this._setLayerProperties();

  this._initializeMapLevel(0);

  this._setupCollision();

  this._setupRegion();

  this._setupMapLevelChange();

  this._setupTileFlags();

  this._setupTiledEvents();
};

Game_Map.prototype.initializeMapProperties = function () {
  this._autoSize = false;
  this._autoSizeBorder = 0;
  this._offsets = {
    x: 0,
    y: 0
  };
  var autoSize = false;
  var border = 0;

  if (this.tiledData.properties) {
    if (this.tiledData.properties.hasOwnProperty('autoSize')) {
      autoSize = this.tiledData.properties.autoSize;
    }

    if (this.tiledData.properties.hasOwnProperty('border')) {
      border = this.tiledData.properties.border;
    }
  }

  this._autoSize = autoSize;
  this._autoSizeBorder = border;
};

Game_Map.prototype.offsets = function () {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (_typeof(x) === 'object') {
    var offsets = {
      x: (x.x || 0) - this._offsets.x,
      y: (x.y || 0) - this._offsets.y
    };

    if (typeof y === 'string' && offsets.hasOwnProperty(y)) {
      return offsets[y];
    }

    return offsets;
  }

  if (x !== false || y !== false) {
    return {
      x: (x || 0) - this._offsets.x,
      y: (y || 0) - this._offsets.y
    };
  }

  return {
    x: this._offsets.x,
    y: this._offsets.y
  };
};
/*
 * I've decided to not use the following functions anymore, as they caused problems when reloading after
 * battle.
 */


Game_Map.prototype.initializeInfiniteMap = function () {
  if (!this.tiledData.infinite) {
    return;
  }

  if (this._autoSize && this._autoSize !== 'false') {
    this._setMapSize();
  }
  /*
  This used to convert chunk data into regular map data. I removed it because I realized that really big maps
  will pose a huge memory problem, especially if you have a lot of layers. It also won't affect the load time,
  as all other data will already be pre-processed.
  */

  /*
  for (let idx = 0; idx < this.tiledData.layers.length; idx++) {
  	let layerData = this.tiledData.layers[idx];
  	if(!layerData.data && !!layerData.chunks) {
  		layerData.data = new Array(this.width() * this.height());
  		layerData.data.fill(0);
  		layerData.chunks.forEach(chunk => {
  			for(let i = 0; i < chunk.data.length; i++) {
  				let x = chunk.x - this._offsets.x + (i % chunk.width);
  				let y = chunk.y - this._offsets.y + Math.floor(i / chunk.width);
  				if(x < 0 || y < 0 || x >= layerData.x + this.width() || y >= layerData.x + this.width()) {
  					continue;
  				}
  				let realX = x + y * this.width();
  				layerData.data[realX] = chunk.data[i];
  			}
  		})
  	}
  }
  */

};
/**
 * Resizes an infinite map so that the entire map is visible.
 * The only thing this does is set the offset and the size of the map,
 * without changing the map data itself.
 */


Game_Map.prototype._setMapSize = function () {
  // Initialize variables
  var minX = false;
  var minY = false;
  var maxX = false;
  var maxY = false;

  for (var idx = 0; idx < this.tiledData.layers.length; idx++) {
    var layer = this.tiledData.layers[idx];

    if (layer.type !== 'tilelayer') {
      continue;
    }

    var x1 = layer.startx;
    var y1 = layer.starty;
    var x2 = x1 + layer.width;
    var y2 = y1 + layer.height;

    if (this._autoSize === 'deep' || this._autoSize === 'crop') {
      if (minX === false || x1 < minX) {
        x1 = this._cropInfiniteMap(layer, x1, minX === false ? x2 : minX);
      }

      if (minY === false || y1 < minY) {
        y1 = this._cropInfiniteMap(layer, y1, minY === false ? y2 : minY, true, true);
      }

      if (maxX === false || x2 > maxX) {
        x2 = this._cropInfiniteMap(layer, x2, maxX === false ? x1 : maxX, false);
      }

      if (maxY === false || y2 > maxY) {
        y2 = this._cropInfiniteMap(layer, y2, maxY === false ? y1 : maxY, false, true);
      }
    }

    minX = minX !== false ? Math.min(minX, x1) : x1;
    minY = minY !== false ? Math.min(minY, y1) : y1;
    maxX = maxX !== false ? Math.max(maxX, x2) : x2;
    maxY = maxY !== false ? Math.max(maxY, y2) : y2;
  }

  if (this._autoSizeBorder) {
    var border = [0, 0, 0, 0];

    if (isNaN(this._autoSizeBorder)) {
      var autoBorder = this.autoSizeBorder.split(' ');
      border[0] = parseInt(autoBorder[0]);
      border[1] = autoBorder.length < 2 ? border[0] : parseInt(autoBorder[1]);
      border[2] = autoBorder.length < 3 ? border[0] : parseInt(autoBorder[2]);
      border[3] = autoBorder.length < 4 ? border[1] : parseInt(autoBorder[3]);
    } else {
      border[0] = this._autoSizeBorder;
      border[1] = this._autoSizeBorder;
      border[2] = this._autoSizeBorder;
      border[3] = this._autoSizeBorder;
    }

    minX -= +border[3];
    minY -= +border[0];
    maxX += +border[1];
    maxY += +border[2];
  }

  this._offsets.x = minX;
  this._offsets.y = minY;
  this.tiledData.width = maxX - minX;
  this.tiledData.height = maxY - minY;
  this._offsets.width = this.tiledData.width;
  this._offsets.height = this.tiledData.height;
};

Game_Map.prototype._cropInfiniteMap = function (layer, offset, limit) {
  var forward = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var vertical = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var o = offset;
  var d = vertical ? 'y' : 'x';
  var s = vertical ? 'height' : 'width';

  while (forward && o < limit || !forward && o > limit) {
    var realO = o - (!forward ? 1 : 0);
    var lineEmpty = true;

    for (var chunkIdx = 0; chunkIdx < layer.chunks.length; chunkIdx++) {
      var chunk = layer.chunks[chunkIdx];

      if (realO < chunk[d] || realO >= chunk[d] + chunk[s]) {
        continue;
      }

      var empty = true;

      for (var o2 = 0; o2 < chunk[s]; o2++) {
        var _coords;

        var coords = (_coords = {}, _defineProperty(_coords, d, realO - chunk[d]), _defineProperty(_coords, vertical ? 'x' : 'y', o2), _coords);
        var i = coords.x + coords.y * chunk.width;

        if (chunk.data[i]) {
          empty = false;
          break;
        }
      }

      if (!empty) {
        lineEmpty = false;
        break;
      }
    }

    if (!lineEmpty) {
      break;
    }

    o += forward ? 1 : -1;
  }

  return o;
};

Game_Map.prototype._setLayerProperties = function () {
  var autoFunctions = {};

  for (var idx = 0; idx < this.tiledData.layers.length; idx++) {
    var layer = this.tiledData.layers[idx];
    var layerProperties = Object.assign({}, layer.properties, {
      layerId: idx
    });

    if (layerProperties.transition) {
      layerProperties.baseAlpha = layer.opacity;
      layerProperties.minAlpha = Math.min(layerProperties.baseAlpha, layer.properties.minimumOpacity || 0);
      layerProperties.isShown = !TiledManager.checkLayerHidden(layer);
      layerProperties.transitionPhase = layerProperties.isShown ? layerProperties.transition : 0;
    }

    if (layerProperties.autoX) {
      layerProperties.autoSpeedX = layerProperties.autoX;
      layerProperties.autoX = 0;
      layerProperties.imageWidth = layerProperties.imageWidth || 0;
      var funcX = 'linear';

      if (layerProperties.autoFunctionX) {
        funcX = layerProperties.autoFunctionX;
      } else if (layerProperties.autoFunction) {
        funcX = layerProperties.autoFunction;
      }

      var tFuncX = TiledManager.getAutoFunction(funcX);

      if (tFuncX) {
        layerProperties.autoXFunction = tFuncX.x || tFuncX.both;
      } else {
        if (!autoFunctions[funcX]) {
          autoFunctions[funcX] = new Function('x', 'y', funcX);
        }

        layerProperties.autoXFunction = autoFunctions[funcX];
      }
    }

    if (layerProperties.autoY) {
      layerProperties.autoSpeedY = layerProperties.autoY;
      layerProperties.autoY = 0;
      layerProperties.imageHeight = layerProperties.imageHeight || 0;
      var funcY = 'linear';

      if (layerProperties.autoFunctionY) {
        funcY = layerProperties.autoFunctionY;
      } else if (layerProperties.autoFunction) {
        funcY = layerProperties.autoFunction;
      }

      var tFuncY = TiledManager.getAutoFunction(funcY);

      if (tFuncY) {
        layerProperties.autoYFunction = tFuncY.y || tFuncY.both;
      } else {
        if (!autoFunctions[funcY]) {
          autoFunctions[funcY] = new Function('x', 'y', funcY);
        }

        layerProperties.autoYFunction = autoFunctions[funcY];
      }
    }

    this._getLayerTilesets(layer, layerProperties);

    this._layerProperties.push(layerProperties);
  }
};

Game_Map.prototype._getLayerTilesets = function (layer, props) {
  if (layer.type !== 'tilelayer') {
    return;
  }

  var width = this.width();
  var height = this.height();
  var size = width * height;
  props.tilesets = [];

  var _iterator = _createForOfIteratorHelper(Array(size).keys()),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var i = _step.value;
      var tileId = TiledManager.extractTileId(layer, i);

      if (!!tileId) {
        var tilesetId = this._getTilesetId(tileId);

        if (tilesetId === -1 || props.tilesets.indexOf(tilesetId) > -1) {
          continue;
        }

        props.tilesets.push(tilesetId);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};

Game_Map.prototype._setupLayers = function () {
  var _this = this;

  this.tiledData.layers.forEach(function (layer) {
    var data = null;
    console.log(layer);

    switch (layer.type) {
      case 'imagelayer':
        data = new _TiledMap_TiledMapImage__WEBPACK_IMPORTED_MODULE_0__["default"](layer);
        break;

      case 'tilelayer':
        data = new _TiledMap_TiledMapLayer__WEBPACK_IMPORTED_MODULE_1__["default"](layer, _this);
        break;

      default:
        break;
    }

    _this._layers.push(data);
  });
  console.log(this._layers, this.tiledData);
};

Game_Map.prototype._initializeMapLevel = function (id) {
  if (!!this._collisionMap[id]) {
    return;
  }

  this._levels.push(id);

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

    var _iterator2 = _createForOfIteratorHelper(Array(size).keys()),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var x = _step2.value;
        typeData.push(defaultValue);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
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

    var _iterator3 = _createForOfIteratorHelper(Array(size).keys()),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var x = _step3.value;
        var realX = x;
        var ids = [];

        if (this.isHalfTile()) {
          realX = Math.floor(x / halfWidth) * width * 2 + x % halfWidth * 2;
        }

        if (!!TiledManager.extractTileId(layerData, x)) {
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
              var tileId = TiledManager.extractTileId(layerData, x);

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

          var _iterator4 = _createForOfIteratorHelper(ids),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var id = _step4.value;
              this._collisionMap[level][layerId][id] = 1;
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
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

    var _iterator5 = _createForOfIteratorHelper(Array(size).keys()),
        _step5;

    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var x = _step5.value;
        var realX = x;

        if (this.isHalfTile()) {
          realX = Math.floor(x / halfWidth) * width * 2 + x % halfWidth * 2;
        }

        if (!!TiledManager.extractTileId(layerData, x)) {
          var realBit = bit;

          if (layerData.properties.collision === "tiles") {
            realBit = 0;
            var tileId = TiledManager.extractTileId(layerData, x);

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
      _iterator5.e(err);
    } finally {
      _iterator5.f();
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

    var regionMap = this._regions[level][layerId];

    var _iterator6 = _createForOfIteratorHelper(Array(size).keys()),
        _step6;

    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var x = _step6.value;
        var realX = x;

        if (this.isHalfTile()) {
          realX = Math.floor(x / halfWidth) * width * 2 + x % halfWidth * 2;
        }

        if (!!TiledManager.extractTileId(layerData, x)) {
          var regionId = 0;

          if (layerData.properties.regionId > -1) {
            regionId = parseInt(layerData.properties.regionId);
          } else {
            var tileId = TiledManager.extractTileId(layerData, x);

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

          regionMap[realX] = regionId;

          if (this.isHalfTile()) {
            regionMap[realX + 1] = regionId;
            regionMap[realX + width] = regionId;
            regionMap[realX + width + 1] = regionId;
          }
        }
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
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

    var _iterator7 = _createForOfIteratorHelper(Array(size).keys()),
        _step7;

    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var x = _step7.value;
        var realX = x;
        var toLevel = parseInt(layerData.properties.toLevel);

        if (this.isHalfTile()) {
          realX = Math.floor(x / halfWidth) * width * 2 + x % halfWidth * 2;
        }

        if (!!TiledManager.extractTileId(layerData, x)) {
          levelChangeMap[realX] = toLevel;

          if (this.isHalfTile()) {
            levelChangeMap[realX + 1] = toLevel;
            levelChangeMap[realX + width] = toLevel;
            levelChangeMap[realX + width + 1] = toLevel;
          }
        }
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
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

    var _iterator8 = _createForOfIteratorHelper(Array(size).keys()),
        _step8;

    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var x = _step8.value;
        var realX = x;
        var toLevel = parseInt(layerData.properties.floorHeight);

        if (this.isHalfTile()) {
          realX = Math.floor(x / halfWidth) * width * 2 + x % halfWidth * 2;
        }

        if (!!TiledManager.extractTileId(layerData, x)) {
          positionHeightChangeMap[realX] = toLevel;

          if (this.isHalfTile()) {
            positionHeightChangeMap[realX + 1] = toLevel;
            positionHeightChangeMap[realX + width] = toLevel;
            positionHeightChangeMap[realX + width + 1] = toLevel;
          }
        }
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
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

    var _iterator9 = _createForOfIteratorHelper(Array(size).keys()),
        _step9;

    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        var x = _step9.value;
        var realX = x;

        if (this.isHalfTile()) {
          realX = Math.floor(x / halfWidth) * width * 2 + x % halfWidth * 2;
        }

        if (!!TiledManager.extractTileId(layerData, x)) {
          var tileFlags = 0;
          var tileId = TiledManager.extractTileId(layerData, x);

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
      _iterator9.e(err);
    } finally {
      _iterator9.f();
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

      for (var i = flags.length; i <= group; i++) {
        flags.push(0);
      }

      flags[group] |= bit;
    }
  });
  return flags.length > 0 ? flags : 0;
};

Game_Map.prototype._combineFlags = function (source, target) {
  source = source ? source.slice(0) : [];

  for (var i = 0; i < target.length; i++) {
    if (!source.length <= i) {
      source.push(i);
    }

    source[i] |= target[i];
  }

  return source;
};

Game_Map.prototype._setupTiledEvents = function () {
  var _iterator10 = _createForOfIteratorHelper(this.tiledData.layers),
      _step10;

  try {
    for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
      var layerData = _step10.value;

      if (layerData.type !== "objectgroup") {
        continue;
      }

      var _iterator11 = _createForOfIteratorHelper(layerData.objects),
          _step11;

      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var object = _step11.value;
          // call the object resolvers to perform actions based on the objects
          TiledManager.processTiledObject(object, this);
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }
    }
  } catch (err) {
    _iterator10.e(err);
  } finally {
    _iterator10.f();
  }
};

Game_Map.prototype.isHalfTile = function () {
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

Game_Map.prototype._getTilesetId = function (tileId) {
  for (var idx = 0; idx < this.tiledData.tilesets.length; idx++) {
    var tileset = this.tiledData.tilesets[idx];

    if (tileId >= tileset.firstgid && tileId < tileset.firstgid + tileset.tilecount) {
      if (tileset.properties && tileset.properties.ignoreLoading) {
        return -1;
      }

      return idx;
    }
  }

  return -1;
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

  if (!this.isTiledMap() || !this.isTiledInitialized()) {
    return _regionId.call(this, x, y);
  }

  var index = Math.floor(x) + this.width() * Math.floor(y);
  var regionMap = this._regions[this.currentMapLevel];

  if (!regionMap) {
    return allIds ? [0] : 0;
  }

  var regionLayer = this._regionsLayers[this.currentMapLevel];
  var regionValue = regionMap.main[index];
  var regionValues = [regionValue];

  if (regionLayer && regionLayer.length > 0) {
    for (var idx = 0; idx < regionLayer.length; idx++) {
      var layerId = regionLayer[idx];
      var layerData = this.tiledData.layers[layerId];
      var hideData = TiledManager.checkLayerHidden(layerData, 'regions');

      if (!hideData) {
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

Game_Map.prototype.getMapLevels = function () {
  var levels = this._levels.slice(0);

  levels.sort(function (a, b) {
    return a - b;
  });
  return levels;
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

  if (!arrows) {
    return true;
  }

  var arrowLayer = this._arrowCollisionMapLayers[level];
  var arrowValue = arrows.main[index];

  if (render && arrows[render]) {
    arrowValue = arrows[render][index];
  } else if (arrowLayer && arrowLayer.length > 0) {
    for (var idx = 0; idx < arrowLayer.length; idx++) {
      var layerId = arrowLayer[idx];
      var layerData = this.tiledData.layers[layerId];
      var hideData = TiledManager.checkLayerHidden(layerData, 'collisions');

      if (!hideData) {
        arrowValue &= arrows[layerId][index];
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

  if (!collisionMap) {
    return true;
  }

  var collisionLayer = this._collisionMapLayers[level];
  var collisionValue = collisionMap.main[index];

  if (render && collisionMap[render]) {
    collisionValue = collisionMap[render][index];
  } else if (collisionLayer && collisionLayer.length > 0) {
    for (var idx = 0; idx < collisionLayer.length; idx++) {
      var layerId = collisionLayer[idx];
      var layerData = this.tiledData.layers[layerId];
      var hideData = TiledManager.checkLayerHidden(layerData, 'collisions');

      if (!hideData) {
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

  if (!mapLevelChange) {
    return false;
  }

  var mapLevelChangeLayer = this._mapLevelChangeLayers[this.currentMapLevel];
  var index = y * this.width() + x;
  var mapLevelChangeValue = mapLevelChange.main[index];

  if (mapLevelChangeLayer.length > 0) {
    for (var idx = 0; idx < mapLevelChangeLayer.length; idx++) {
      var layerId = mapLevelChangeLayer[idx];
      var layerData = this.tiledData.layers[layerId];
      var hideData = TiledManager.checkLayerHidden(layerData, 'levelChanges');

      if (!hideData) {
        mapLevelChangeValue = mapLevelChange[layerId][index];
      }
    }
  }

  if (mapLevelChangeValue < 0) {
    return false;
  }

  var oldValue = this.currentMapLevel;
  this.currentMapLevel = mapLevelChangeValue;
  TiledManager.triggerListener(this, 'levelchanged', {
    oldLevel: oldValue,
    newLevel: mapLevelChangeValue
  });
  return true;
};

Game_Map.prototype.checkPositionHeight = function (x, y) {
  var positionHeightChange = this._positionHeightChange[this.currentMapLevel];

  if (!positionHeightChange) {
    return -1;
  }

  var positionHeightChangeLayer = this._positionHeightChangeLayers[this.currentMapLevel];
  var index = y * this.width() + x;
  var positionHeightChangeValue = positionHeightChange.main[index];

  if (positionHeightChangeLayer.length > 0) {
    for (var idx = 0; idx < positionHeightChangeLayer.length; idx++) {
      var layerId = positionHeightChangeLayer[idx];
      var layerData = this.tiledData.layers[layerId];
      var hideData = TiledManager.checkLayerHidden(layerData, 'positionHeightChanges');

      if (!hideData) {
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

  if (!tileFlags) {
    return [];
  }

  var tileFlagsLayer = this._tileFlagsLayers[level];
  var tileFlagsValue = tileFlags.main[index] ? tileFlags.main[index].slice(0) : [];

  if (render && tileFlags[render]) {
    tileFlagsValue = tileFlags[render][index] ? tileFlags[render][index].slice(0) : [];
  } else if (tileFlagsLayer && tileFlagsLayer.length > 0) {
    for (var idx = 0; idx < tileFlagsLayer.length; idx++) {
      var layerId = tileFlagsLayer[idx];
      var layerData = this.tiledData.layers[layerId];
      var hideData = TiledManager.checkLayerHidden(layerData, 'tileFlags');

      if (!hideData && tileFlags[layerId][index]) {
        tileFlagsValue = this._combineFlags(tileFlagsValue, tileFlags[layerId][index]);
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

Game_Map.prototype.getTileFlagLayers = function (level) {
  return this._tileFlagsLayers[level].slice(0);
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

var _isHealFloor = Game_Map.prototype.isHealFloor;

Game_Map.prototype.isHealFloor = function (x, y) {
  var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (level === false) {
    level = 0;
  }

  return this.isValid(x, y) && this.checkHasTileFlag(x, y, 'heal', render);
};

Game_Map.prototype.getAllLayerProperties = function () {
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
      if (!ignoreHidden || !TiledManager.checkLayerHidden(layerData, 'collisions')) {
        layerProperties[i] = Object.assign({}, layerData.properties);
      }
    }
  });
  return layerProperties;
};

Game_Map.prototype.getTileProperties = function (x, y) {
  var _this2 = this;

  var layer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
  var ignoreHidden = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var index = x + this.width() * y;

  if (layer > -1) {
    if (this.tiledData.layers[layer] && (this.tiledData.layers[layer].data || this.tiledData.layers[layer].chunks)) {
      var tileId = TiledManager.extractTileId(this.tiledData.layers[layer], index);

      var tileset = this._getTileset(tileId);

      if (tileset && tileset.tileproperties) {
        return Object.assign({}, tileset.tileproperties[tileId - tileset.firstgid]);
      }
    }

    return {};
  }

  var tileProperties = {};
  this.tiledData.layers.forEach(function (layerData, i) {
    if (layerData && (layerData.data || layerData.chunks) && layerData.properties) {
      if (!ignoreHidden || !TiledManager.checkLayerHidden(layerData)) {
        var props = _this2.getTileProperties(x, y, i);

        if (Object.keys(props).length > 0) {
          tileProperties[i] = props;
        }
      }
    }
  });
  return tileProperties;
};
/* Custom vehicles */


var _createVehicles = Game_Map.prototype.createVehicles;

Game_Map.prototype.createVehicles = function () {
  if (!this.isTiledMap()) {
    _createVehicles.call(this);
  }

  this._vehicles = [];
};

var _refreshVehicles = Game_Map.prototype.refereshVehicles;

Game_Map.prototype.refereshVehicles = function () {
  if (!this.isTiledMap()) {
    return _refreshVehicles.call(this);
  }

  return TiledManager.refreshVehicles(this._vehicles);
};

var _vehicles = Game_Map.prototype.vehicles;

Game_Map.prototype.vehicles = function () {
  var getNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (!this.isTiledMap()) {
    return _vehicles.call(this);
  }

  if (getNames) {
    return this._vehicles;
  }

  return TiledManager.getAllVehicles(this._vehicles);
};

var _vehicle = Game_Map.prototype.vehicle;

Game_Map.prototype.vehicle = function (type) {
  if (!this.isTiledMap()) {
    return _vehicles.call(this, type);
  }

  return TiledManager.getVehicle(type);
};

var _boat = Game_Map.prototype.boat;

Game_Map.prototype.boat = function () {
  if (!this.isTiledMap()) {
    return _boat.call(this);
  }

  return TiledManager.getVehicle('boat');
};

var _ship = Game_Map.prototype.ship;

Game_Map.prototype.ship = function () {
  if (!this.isTiledMap()) {
    return _ship.call(this);
  }

  return TiledManager.getVehicle('ship');
};

var _airship = Game_Map.prototype.airship;

Game_Map.prototype.airship = function () {
  if (!this.isTiledMap()) {
    return _airship.call(this);
  }

  return TiledManager.getVehicle('airship');
};

var _updateVehicles = Game_Map.prototype.updateVehicles;

Game_Map.prototype.updateVehicles = function () {
  if (!this.isTiledMap()) {
    _updateVehicles.call(this);
  }

  TiledManager.updateVehicles(this._vehicles);
};

Game_Map.prototype.waypoint = function (waypoint) {
  if (this._waypoints[waypoint]) {
    return this._waypoints[waypoint];
  }

  return null;
};

var _update = Game_Map.prototype.update;

Game_Map.prototype.update = function (sceneActive) {
  this.setLayerProperties();

  _update.call(this, sceneActive);
};

Game_Map.prototype.getLayerProperties = function (layerId) {
  return Object.assign({}, this._layerProperties[layerId]);
};

Game_Map.prototype.setLayerProperties = function () {
  var _this3 = this;

  this._layerProperties.forEach(function (props, i) {
    var layer = _this3.tiledData.layers[i];

    if (props.transition) {
      props.isShown = !TiledManager.checkLayerHidden(layer);
      props.transitionPhase = Math.max(0, Math.min(props.transition, props.transitionPhase + (props.isShown ? 1 : -1)));
    }

    if (props.autoSpeedX) {
      props.autoX += props.autoSpeedX;

      if (props.autoDuration || props.imageWidth) {
        while (props.autoX < 0) {
          props.autoX += props.autoDuration || props.imageWidth;
        }

        while (props.autoX > props.imageWidth) {
          props.autoX -= props.autoDuration || props.imageWidth;
        }
      }
    }

    if (props.autoSpeedY) {
      props.autoY += props.autoSpeedY;

      if (props.imageHeight) {
        while (props.autoY < 0) {
          props.autoY += props.autoDuration || props.imageHeight;
        }

        while (props.autoY > props.imageHeight) {
          props.autoY -= props.autoDuration || props.imageHeight;
        }
      }
    }
  });
};

var _battleback1Name = Game_Map.prototype.battleback1Name;

Game_Map.prototype.battleback1Name = function () {
  if (!this.isTiledMap()) {
    return _battleback1Name.call(this);
  }

  var tileProps = Game_Map.prototype.getTileProperties($gamePlayer.x, $gamePlayer.y);
  var battleback = false;
  Object.keys(tileProps).forEach(function (layerId) {
    var props = tileProps[layerId];

    if (props.hasOwnProperty('battleback1Name')) {
      battleback = props.battleback1Name;
    }
  });

  if (battleback || battleback === '') {
    return battleback;
  }

  return _battleback1Name.call(this);
};

var _battleback2Name = Game_Map.prototype.battleback2Name;

Game_Map.prototype.battleback2Name = function () {
  if (!this.isTiledMap()) {
    return _battleback2Name.call(this);
  }

  var tileProps = Game_Map.prototype.getTileProperties($gamePlayer.x, $gamePlayer.y);
  var battleback = false;
  Object.keys(tileProps).forEach(function (layerId) {
    var props = tileProps[layerId];

    if (props.hasOwnProperty('battleback2Name')) {
      battleback = props.battleback2Name;
    }
  });

  if (battleback || battleback === '') {
    return battleback;
  }

  return _battleback2Name.call(this);
};

/***/ }),

/***/ "./src/Game_Player.js":
/*!****************************!*\
  !*** ./src/Game_Player.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var _initMembers = Game_Player.prototype.initMembers;

Game_Player.prototype.initMembers = function () {
  _initMembers.call(this);

  this._newWaypoint = '';
};

var _checkEventTriggerHere = Game_Player.prototype.checkEventTriggerHere;

Game_Player.prototype.checkEventTriggerHere = function (triggers) {
  _checkEventTriggerHere.call(this, triggers);

  this._checkMapLevelChangingHere();
};

Game_Player.prototype._checkMapLevelChangingHere = function () {
  var oldLevel = $gameMap.currentMapLevel;
  $gameMap.checkMapLevelChanging(this.x, this.y);
  TiledManager.triggerListener(this, 'levelchanged', {
    oldLevel: oldLevel,
    newLevel: $gameMap.currentMapLevel
  });
};

Game_Player.prototype.isOnHealFloor = function () {
  return $gameMap.isHealFloor(this.x, this.y) && !this.isInAirship();
};

var _getOnVehicle = Game_Player.prototype.getOnVehicle;

Game_Player.prototype.getOnVehicle = function () {
  var _this = this;

  if (!$gameMap.isTiledMap()) {
    return _getOnVehicle.call(this);
  }

  var direction = this.direction();
  var x1 = this.x;
  var y1 = this.y;
  var x2 = $gameMap.roundXWithDirection(x1, direction);
  var y2 = $gameMap.roundYWithDirection(y1, direction);

  if ($gameMap.airship().pos(x1, y1)) {
    this._vehicleType = 'airship';
  } else if ($gameMap.ship().pos(x2, y2)) {
    this._vehicleType = 'ship';
  } else if ($gameMap.boat().pos(x2, y2)) {
    this._vehicleType = 'boat';
  } else {
    var vehicles = $gameMap.vehicles(true);
    vehicles.forEach(function (vehicleName) {
      var vehicle = $gameMap.vehicle(vehicleName);

      if (vehicle.vehicleData) {
        if (!vehicle.vehicleData.hasOwnProperty('hasCollision') || vehicle.vehicleData.hasCollision === 'true' || vehicle.vehicleData.hasCollision === true) {
          if (vehicle.pos(x2, y2)) {
            _this._vehicleType = vehicleName;
          }
        } else {
          if (vehicle.pos(x1, y1)) {
            _this._vehicleType = vehicleName;
          }
        }
      } else if (vehicle.pos(x2, y2)) {
        _this._vehicleType = vehicleName;
      }
    });
  }

  if (this.isInVehicle()) {
    this._vehicleGettingOn = true;

    if (!this.isInAirship()) {
      this.forceMoveForward();
    }

    this.gatherFollowers();
  }

  return this._vehicleGettingOn;
};

var _gamePlayerTriggerTouchActionD2 = Game_Player.prototype.triggerTouchActionD2;

Game_Player.prototype.triggerTouchActionD2 = function (x2, y2) {
  if (!$gameMap.isTiledMap()) {
    return _gamePlayerTriggerTouchActionD2.call(this, x2, y2);
  }

  if ($gameMap.boat().pos(x2, y2) || $gameMap.ship().pos(x2, y2)) {
    if (TouchInput.isTriggered() && this.getOnVehicle()) {
      return true;
    }
  }

  if (this.isInBoat() || this.isInShip()) {
    if (TouchInput.isTriggered() && this.getOffVehicle()) {
      return true;
    }
  }

  var vehicles = $gameMap.vehicles(true);

  for (var idx = 0; idx < vehicles.length; idx++) {
    var vehicle = $gameMap.vehicle(vehicles[idx]);

    if (!vehicle.vehicleData || !vehicle.vehicleData.hasOwnProperty('hasCollision') || vehicle.vehicleData.hasCollision === 'true' || vehicle.vehicleData.hasCollision === true) {
      if (vehicle.pos(x2, y2) && TouchInput.isTriggered() && this.getOnVehicle()) {
        return true;
      }

      if (this._vehicleType === vehicles[idx] && TouchInput.isTriggered() && this.getOffVehicle()) {
        return true;
      }
    }
  }

  this.checkEventTriggerThere([0, 1, 2]);
  return $gameMap.setupStartingEvent();
};

var _isInVehicle = Game_Player.prototype.isInVehicle;

Game_Player.prototype.isInVehicle = function () {
  if (!$gameMap.isTiledMap()) {
    return _isInVehicle.call(this);
  }

  return $gameMap.vehicles(true).indexOf(this._vehicleType) > -1;
};

var _reserveTransfer = Game_Player.prototype.reserveTransfer;

Game_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
  var waypoint = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';

  _reserveTransfer.call(this, mapId, x, y, d, fadeType);

  this._newWaypoint = waypoint;
};

Game_Player.prototype.performTransfer = function () {
  if (this.isTransferring()) {
    this.setDirection(this._newDirection);

    if (this._newMapId !== $gameMap.mapId() || this._needsMapReload) {
      $gameMap.setup(this._newMapId);
      this._needsMapReload = false;
    }

    var newX = this._newX;
    var newY = this._newY;

    if ($gameMap.isTiledMap()) {
      if (this._newWaypoint) {
        var waypoint = $gameMap.waypoint(this._newWaypoint);

        if (waypoint) {
          newX = waypoint.x;
          newY = waypoint.y;
        }
      }

      var offsets = $gameMap.offsets();

      if (offsets && offsets.hasOwnProperty('x') && offsets.hasOwnProperty('y')) {
        newX -= offsets.x;
        newY -= offsets.y;
      }
    }

    this.locate(newX, newY);
    this.refresh();
    this.clearTransferInfo();
  }
};

var _clearTransferInfo = Game_Player.prototype.clearTransferInfo;

Game_Player.prototype.clearTransferInfo = function () {
  _clearTransferInfo.call(this);

  this._newWaypoint = '';
};

/***/ }),

/***/ "./src/Game_Screen.js":
/*!****************************!*\
  !*** ./src/Game_Screen.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

Game_Screen.prototype.startFlashForHeal = function () {
  this.startFlash([128, 192, 255, 128], 8);
};

/***/ }),

/***/ "./src/Game_Vehicle.js":
/*!*****************************!*\
  !*** ./src/Game_Vehicle.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var _initialize = Game_Vehicle.prototype.initialize;

Game_Vehicle.prototype.initialize = function (type) {
  var vehicleData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (vehicleData) {
    this.vehicleData = vehicleData;
  }

  _initialize.call(this, type);
};

var _initMoveSpeed = Game_Vehicle.prototype.initMoveSpeed;

Game_Vehicle.prototype.initMoveSpeed = function () {
  _initMoveSpeed.call(this);

  if (!!this.vehicleData && this.vehicleData.moveSpeed) {
    this.setMoveSpeed(parseInt(this.vehicleData.moveSpeed));
  }
};

var _vehicle = Game_Vehicle.prototype.vehicle;

Game_Vehicle.prototype.vehicle = function () {
  var vehicleData = _vehicle.call(this);

  if (!vehicleData && !!this.vehicleData) {
    return this.vehicleData;
  }

  return vehicleData;
};

var _isMapPassable = Game_Vehicle.prototype.isMapPassable;

Game_Vehicle.prototype.isMapPassable = function (x, y, d) {
  var render = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (!$gameMap.isTiledMap()) {
    return _isMapPassable.call(this, x, y, d);
  }

  var x2 = $gameMap.roundXWithDirection(x, d);
  var y2 = $gameMap.roundYWithDirection(y, d);

  if (this.isBoat()) {
    return $gameMap.isBoatPassable(x2, y2, render);
  } else if (this.isShip()) {
    return $gameMap.isShipPassable(x2, y2, render);
  } else if (this.isAirship()) {
    return true;
  } else {
    var vehicleData = this.vehicle();

    if (!!vehicleData) {
      if (!!vehicleData.tileFlag) {
        return $gameMap.checkHasTileFlag(x2, y2, vehicleData.tileFlag, render);
      }

      if (vehicleData.tileFlag === '') {
        return true;
      }
    }

    return false;
  }
};

Game_Vehicle.prototype.loadSystemSettings = function () {
  var vehicle = window.$dataSystem ? this.vehicle() : null;

  if (vehicle) {
    this._mapId = vehicle.startMapId;
    this.setPosition(vehicle.startX, vehicle.startY);
    this.setImage(vehicle.characterName, vehicle.characterIndex);
  }
};

var _resetDirection = Game_Vehicle.prototype.resetDirection;

Game_Vehicle.prototype.resetDirection = function () {
  if (!!this.vehicleData && !!this.vehicleData.direction) {
    this.setDirection(parseInt(this.vehicleData.direction));
  } else {
    _resetDirection.call(this);
  }
};

Game_Vehicle.prototype.getOff = function () {
  this._driving = false;
  this.setWalkAnime(false);
  this.setStepAnime(false);

  if (!this.vehicleData || !this.vehicleData.hasOwnProperty('resetDirection') || this.vehicleData.resetDirection === 'true') {
    this.resetDirection();
  }

  $gameSystem.replayWalkingBgm();
};

/***/ }),

/***/ "./src/ImageManager.js":
/*!*****************************!*\
  !*** ./src/ImageManager.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

ImageManager.loadParserTileset = function (path, hue) {
  if (!path) {
    return this.loadEmptyBitmap();
  }

  var paths = path.split("/");

  while (paths[0] === '..') {
    paths.shift();
  }

  var filename = paths[paths.length - 1];
  var realPath = "img/tilesets/" + filename;

  if (paths[0] === 'img') {
    realPath = paths.slice(0, -1).join('/') + '/' + filename;
  }

  return this.loadNormalBitmap(realPath, hue);
};

ImageManager.loadParserParallax = function (path, hue) {
  if (!path) {
    return this.loadEmptyBitmap();
  }

  var paths = path.split("/");

  while (paths[0] === '..') {
    paths.shift();
  }

  var filename = paths[paths.length - 1];
  var realPath = "img/parallaxes/" + filename;

  if (paths[0] === 'img') {
    realPath = paths.slice(0, -1).join('/') + '/' + filename;
  }

  return this.loadNormalBitmap(realPath, hue);
};

/***/ }),

/***/ "./src/Sprite_Character.js":
/*!*********************************!*\
  !*** ./src/Sprite_Character.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var _update = Sprite_Character.prototype.update;

Sprite_Character.prototype.update = function () {
  _update.call(this);

  this.locationHeight = this._character.locationHeight();
};

/***/ }),

/***/ "./src/Sprite_TiledPriorityTile.js":
/*!*****************************************!*\
  !*** ./src/Sprite_TiledPriorityTile.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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
  var visibility = false;

  if (this.layerId > -1) {
    visibility = true;
    var props = $gameMap.getLayerProperties(this.layerId);

    if (props.transition) {
      visibility = props.minAlpha > 0 || props.transitionPhase > 0;
      this.opacity = 255 * ((props.baseAlpha - props.minAlpha) * (props.transitionPhase / props.transition) + props.minAlpha);
    } else {
      var layer = $gameMap.tiledData.layers[this.layerId];
      visibility = !TiledManager.checkLayerHidden(layer);
    }
  }

  this.visible = visibility;
};

/***/ }),

/***/ "./src/Spriteset_Map.js":
/*!******************************!*\
  !*** ./src/Spriteset_Map.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TiledTilemap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TiledTilemap */ "./src/TiledTilemap/index.js");
function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


var _initialize = Spriteset_Battle.prototype.initialize;

Spriteset_Battle.prototype.initialize = function () {
  this._parallaxContainers = {};

  _initialize.call(this);
};

var _createTilemap = Spriteset_Map.prototype.createTilemap;

Spriteset_Map.prototype.createTilemap = function () {
  if (!$gameMap.isTiledMap()) {
    _createTilemap.call(this);

    return;
  }

  this._tilemap = new _TiledTilemap__WEBPACK_IMPORTED_MODULE_0__["default"]($gameMap.tiledData, $gameMap.layers);
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

  var _iterator = _createForOfIteratorHelper($gameMap.tiledData.tilesets),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var tileset = _step.value;

      if (tileset.properties && tileset.properties.ignoreLoading) {
        continue;
      }

      if (tileset.image) {
        var bitmap = ImageManager.loadParserTileset(tileset.image, 0);

        this._tilemap.bitmaps.push(bitmap);

        this._tilemap.indexedBitmaps[i] = bitmap;
      } else {
        this._tilemap.indexedBitmaps[i] = [];

        for (var tile = 0; tile < tileset.tilecount; tile++) {
          if (tileset.tiles[tile]) {
            var _bitmap = ImageManager.loadParserTileset(tileset.tiles[tile].image, 0);

            this._tilemap.bitmaps.push(_bitmap);

            this._tilemap.indexedBitmaps[i][tile] = _bitmap;
          }
        }
      }

      i++;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  this._tilemap.refreshTileset();

  this._tileset = $gameMap.tiledData.tilesets;
};

var _update = Spriteset_Map.prototype.update;

Spriteset_Map.prototype.update = function () {
  _update.call(this); //Disabed updateHideOnLevel, since it got moved to the general layer hide functions
  //this._updateHideOnLevel();


  this._updateHideOnSpecial();

  this._tilemap.updateImageLayer();
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

/***/ "./src/TiledManager.js":
/*!*****************************!*\
  !*** ./src/TiledManager.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

//-----------------------------------------------------------------------------
// TiledManager
//
// The static class that manages TileD data, including extensions.
function TiledManager() {
  throw new Error('This is a static class');
}

window.TiledManager = TiledManager;
var pluginParams = PluginManager.parameters("YED_Tiled");
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
var _vehicles = {};
var _vehiclesByIndex = [];
var _autoFunctions = {};
var _pluginCommands = {};
var _fullVehicleData = {
  bgm: {
    name: '',
    pan: 0,
    pitch: 100,
    volume: 90
  },
  characterIndex: 0,
  characterName: "",
  startMapId: 0,
  startX: 0,
  startY: 0
};
var _processEncoding = {
  base64: function base64(data) {
    var decodedData = atob(data);
    var newData = [];

    for (var idx = 0; idx < decodedData.length; idx += 4) {
      newData.push(decodedData.charCodeAt(idx) | (decodedData.charCodeAt(idx + 1) || 0) << 8 | (decodedData.charCodeAt(idx + 2) || 0) << 16 | (decodedData.charCodeAt(idx + 3) || 0) << 24);
    }

    return newData;
  }
};
var _registeredObjectResolvers = [];

TiledManager.addListener = function (objectName, event, callback) {
  var recursive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  if (typeof objectName === 'function') {
    objectName = objectName.name;
  }

  if (!_listeners[objectName]) {
    _listeners[objectName] = {};
  }

  if (!_listeners[objectName][event]) {
    _listeners[objectName][event] = [];
  }

  callback.recursive = !!recursive;

  _listeners[objectName][event].push(callback);
};

TiledManager.triggerListener = function (object, event) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Handle static classes such as managers
  var isStatic = object.constructor.name === "Function";
  var objectName = isStatic ? object.name : object.constructor.name;

  if (!_listeners[objectName] || !_listeners[objectName][event]) {
    return false;
  }

  if (isStatic) {
    _listeners[objectName][event].forEach(function (callback) {
      if (top || callback.recursive) {
        callback.call(object, options);
      }
    });
  } else {
    (function () {
      var top = true;
      var proto = object.__proto__;

      while (proto) {
        objectName = proto.constructor.name;

        if (_listeners[objectName] && _listeners[objectName][event]) {
          _listeners[objectName][event].forEach(function (callback) {
            if (top || callback.recursive) {
              callback.call(object, options);
            }
          });
        }

        top = false;
        proto = proto.__proto__;
      }
    })();
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
  var data = false;

  for (var idx = 0; idx < keys.length; idx++) {
    if (ignore.indexOf(keys) !== -1) {
      continue;
    }

    if (layerData.properties && layerData.properties.hasOwnProperty(keys[idx])) {
      data = data || _hideFunctions[keys[idx]](layerData);
    }

    if (data) {
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

TiledManager.processTiledData = function () {
  var parentLayer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (!parentLayer) {
    parentLayer = $gameData.tiledData;
  }

  if (!parentLayer) {
    return;
  }

  for (var idx = 0; idx < parentLayer.layers.length; idx++) {
    var layer = parentLayer.layers[idx];

    if (layer.type === 'group') {
      TiledManager.processTiledData(layer);
      Array.prototype.splice.apply(parentLayer.layers, [idx, 1].concat(layer.layers));
      idx += layer.layers.length - 1;
    } else if (layer.type === 'tilelayer') {
      var encoding = layer.encoding || '';

      if (encoding && _processEncoding.hasOwnProperty(encoding)) {
        (function () {
          var encFunc = _processEncoding[encoding];

          if (layer.data) {
            layer.data = encFunc(layer.data);
          } else if (layer.chunks) {
            layer.chunks.forEach(function (chunk) {
              chunk.data = encFunc(chunk.data);
            });
          }
        })();
      }
    } // Trigger listener that a layer has been processed.


    TiledManager.triggerListener(TiledManager, "tiledlayerdataprocessed", layer, parentLayer);
  }

  $gameMap.initializeMapProperties();
  $gameMap.initializeInfiniteMap();
};

TiledManager.extractTileId = function (layerData, i) {
  if (layerData.data) {
    return layerData.data[i];
  } else {
    var x = i % $gameMap.width();
    var y = Math.floor(i / $gameMap.width());
    var offsets = $gameMap.offsets();
    x += offsets.x;
    y += offsets.y;

    if (x < layerData.startx || y < layerData.starty || x >= layerData.startx + layerData.width || y >= layerData.starty + layerData.height) {
      return 0;
    }

    for (var chunkIdx = 0; chunkIdx < layerData.chunks.length; chunkIdx++) {
      var chunk = layerData.chunks[chunkIdx];

      if (x < chunk.x || y < chunk.y || x >= chunk.x + chunk.width || y >= chunk.y + chunk.height) {
        continue;
      }

      return chunk.data[x - chunk.x + (y - chunk.y) * chunk.width];
    }

    return 0;
  }
};
/* TILE FLAGS */


TiledManager.addFlag = function () {
  for (var _len = arguments.length, flagIds = new Array(_len), _key = 0; _key < _len; _key++) {
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

TiledManager.getParameterFlags = function () {
  if (!!pluginParams['Custom Tile Flags']) {
    var tileFlags = JSON.parse(pluginParams['Custom Tile Flags']);
    TiledManager.addFlag.apply(this, tileFlags);
  }
};
/* VEHICLES */


TiledManager.createVehicle = function (vehicleName) {
  var vehicleData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!vehicleData) {
    vehicleData = Object.assign({}, _fullVehicleData, {
      bgm: Object.assign({}, _fullVehicleData.bgm)
    });
  } else if (vehicleData !== true) {
    vehicleData = Object.assign({}, _fullVehicleData, vehicleData, {
      bgm: Object.assign({}, _fullVehicleData.bgm, vehicleData.bgm)
    });
  }

  var vehicle = new Game_Vehicle(vehicleName, vehicleData);
  _vehicles[vehicleName] = vehicle;

  _vehiclesByIndex.push(vehicleName);
};

TiledManager.refreshVehicles = function () {
  var vehicles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  _vehiclesByIndex.forEach(function (vehicleName) {
    if (vehicles.length === 0 || vehicles.indexOf(vehicleName) > -1) {
      _vehicles[vehicleName].refresh();
    }
  });
};

TiledManager.getAllVehicles = function () {
  var vehicles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var returnVehicles = [];

  _vehiclesByIndex.forEach(function (vehicleName) {
    if (vehicles.length === 0 || vehicles.indexOf(vehicleName) > -1) {
      returnVehicles.push(_vehicles[vehicleName]);
    }
  });

  return returnVehicles;
};

TiledManager.getVehicle = function (id) {
  if (isNaN(id)) {
    if (_vehicles[id]) {
      return _vehicles[id];
    }
  } else {
    if (id < _vehiclesByIndex.length) {
      return _vehicles[_vehiclesByIndex[id]];
    }
  }

  return null;
};

TiledManager.updateVehicles = function () {
  var vehicles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  _vehiclesByIndex.forEach(function (vehicleName) {
    if (vehicles.length === 0 || vehicles.indexOf(vehicleName) > -1) {
      _vehicles[vehicleName].update();
    }
  });
};

TiledManager.getParameterVehicles = function () {
  if (!!pluginParams['Custom Vehicles']) {
    var vehicles = JSON.parse(pluginParams['Custom Vehicles']);
    vehicles.forEach(function (vehicle) {
      var vehicleData = JSON.parse(vehicle);
      TiledManager.createVehicle(vehicleData.vehicleName, vehicleData);
    });
  }
};

TiledManager.setAutoFunction = function (identifier) {
  var functions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  _autoFunctions[identifier] = functions;
};

TiledManager.getAutoFunction = function (identifier) {
  return _autoFunctions[identifier] || false;
};
/* Tiled Object Handlers */


TiledManager.objectResolvers = {};
/**
 * Registers an object resolver that will pre-process a tiled object.
 * The object resolver should return true if it processed the object, so then
 * other resolvers won't be called.
 * @param {(object, map)=>boolean} resolver
 */

TiledManager.registerTiledObjectResolver = function (resolver) {
  _registeredObjectResolvers.push(resolver);
};
/**
 * Object resolver for handling waypoints
 * @param {*} object 
 * @param {*} map 
 */


TiledManager.objectResolvers.waypoint = function (object, map) {
  if (object.properties && object.properties.waypoint) {
    var x = object.x / map.tileWidth();
    var y = object.y / map.tileHeight();

    if (pluginParams["Constrain Events to Grid"].toLowerCase() === "true") {
      x = Math.floor(x);
      y = Math.floor(y);
    }

    map._waypoints[object.properties.waypoint] = {
      x: x,
      y: y
    };
    return true;
  }

  return false;
};
/**
 * Object resolver for mapping to an existing event
 * @param {*} object 
 * @param {*} map 
 */


TiledManager.objectResolvers.eventId = function (object, map) {
  if (object.properties && object.properties.eventId) {
    var event;
    var eventId = parseInt(object.properties.eventId);
    event = map._events[eventId];

    if (event) {
      var x = object.x / map.tileWidth() - map._offsets.x;

      var y = object.y / map.tileHeight() - map._offsets.y;

      if (pluginParams["Constrain Events to Grid"].toLowerCase() === "true") {
        x = Math.floor(x);
        y = Math.floor(y);
      }

      if (map.isHalfTile()) {
        x += 1;
        y += 1;
      }

      event.locate(x, y);
      event._tiledProperties = object.properties;
      return true;
    }
  }

  return false;
};
/**
 * Object resolver for mapping a vehicle
 * @param {*} object 
 * @param {*} map 
 */


TiledManager.objectResolvers.vehicle = function (object, map) {
  if (object.properties && object.properties.vehicle) {
    var event = map.vehicle(object.properties.vehicle);

    map._vehicles.push(object.properties.vehicle);

    if (event) {
      var x = object.x / map.tileWidth() - map._offsets.x;

      var y = object.y / map.tileHeight() - map._offsets.y;

      if (pluginParams["Constrain Events to Grid"].toLowerCase() === "true") {
        x = Math.floor(x);
        y = Math.floor(y);
      }

      if (map.isHalfTile()) {
        x += 1;
        y += 1;
      }

      event.loadSystemSettings();
      event.setLocation(map.mapId(), x, y);
      event._tiledProperties = object.properties;
      return true;
    }
  }

  return false;
};

TiledManager.registerStandardResolvers = function () {
  TiledManager.registerTiledObjectResolver(TiledManager.objectResolvers.waypoint);
  TiledManager.registerTiledObjectResolver(TiledManager.objectResolvers.eventId);
  TiledManager.registerTiledObjectResolver(TiledManager.objectResolvers.vehicle);
};

TiledManager.processTiledObject = function (object, map) {
  _registeredObjectResolvers.some(function (r) {
    return r(object, map);
  });
};
/* PLUGIN COMMANDS */


TiledManager.addPluginCommand = function (command, func) {
  _pluginCommands[command] = func;
};

TiledManager.pluginCommand = function (command, args) {
  if (_pluginCommands.hasOwnProperty(command)) {
    _pluginCommands[command].call(this, args);
  }
};

/***/ }),

/***/ "./src/TiledMap/TiledMapImage.js":
/*!***************************************!*\
  !*** ./src/TiledMap/TiledMapImage.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TiledMapImage; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TiledMapImage = /*#__PURE__*/function () {
  function TiledMapImage(layer) {
    var _this = this;

    _classCallCheck(this, TiledMapImage);

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
      ['autoX', 'autoY', 'deltaX', 'deltaY', 'repeatX', 'repeatY', 'viewportX', 'viewportY', 'viewportWidth', 'viewportHeight', 'viewportDeltaX', 'viewportDeltaY', 'hue', 'ignoreLoading'].forEach(function (prop) {
        if (typeof layer.properties[prop] !== 'undefined') {
          _this[prop] = layer.properties[prop];
        }
      });
      this.z = layer.z || layer.properties.zIndex || this.z;
    }

    this.visible = layer.visible;
  }

  _createClass(TiledMapImage, [{
    key: "baseX",
    get: function get() {
      return this.x + this.offsetX;
    }
  }, {
    key: "baseY",
    get: function get() {
      return this.y + this.offsetY;
    }
  }]);

  return TiledMapImage;
}();



/***/ }),

/***/ "./src/TiledMap/TiledMapLayer.js":
/*!***************************************!*\
  !*** ./src/TiledMap/TiledMapLayer.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TiledMapLayer; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TiledMapLayer = function TiledMapLayer(layer, gameMap) {
  _classCallCheck(this, TiledMapLayer);

  this.name = layer.name;
};



/***/ }),

/***/ "./src/TiledTileLayer.js":
/*!*******************************!*\
  !*** ./src/TiledTileLayer.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TiledTileLayer; });
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TiledTileLayer = /*#__PURE__*/function (_PIXI$tilemap$Composi) {
  _inherits(TiledTileLayer, _PIXI$tilemap$Composi);

  var _super = _createSuper(TiledTileLayer);

  function TiledTileLayer(zIndex, bitmaps, useSquare, texPerChild) {
    _classCallCheck(this, TiledTileLayer);

    return _super.call(this, zIndex, bitmaps, useSquare, texPerChild);
  }

  _createClass(TiledTileLayer, [{
    key: "renderWebGL",
    value: function renderWebGL(renderer) {
      var alpha = this.alpha;
      var props = $gameMap.getLayerProperties(this.layerId);

      if (props.transition) {
        alpha -= props.minAlpha;
        alpha *= props.transitionPhase / props.transition;
        alpha += props.minAlpha;
      }

      var gl = renderer.gl;
      var shader = renderer.plugins.tilemap.getShader(this.useSquare);
      renderer.setObjectRenderer(renderer.plugins.tilemap);
      renderer.bindShader(shader);
      this._globalMat = this._globalMat || new PIXI.Matrix();

      renderer._activeRenderTarget.projectionMatrix.copy(this._globalMat).append(this.worldTransform);

      shader.uniforms.projectionMatrix = this._globalMat.toArray(true);
      shader.uniforms.shadowColor = this.shadowColor;
      shader.uniforms.uAlpha = alpha;

      if (this.useSquare) {
        var tempScale = this._tempScale = this._tempScale || [0, 0];
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
  }]);

  return TiledTileLayer;
}(PIXI.tilemap.CompositeRectTileLayer);



/***/ }),

/***/ "./src/TiledTileRenderer.js":
/*!**********************************!*\
  !*** ./src/TiledTileRenderer.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TiledTileShader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TiledTileShader */ "./src/TiledTileShader.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var TiledTileRenderer = /*#__PURE__*/function (_PIXI$tilemap$TileRen) {
  _inherits(TiledTileRenderer, _PIXI$tilemap$TileRen);

  var _super = _createSuper(TiledTileRenderer);

  function TiledTileRenderer() {
    _classCallCheck(this, TiledTileRenderer);

    return _super.apply(this, arguments);
  }

  _createClass(TiledTileRenderer, [{
    key: "onContextChange",
    value: function onContextChange() {
      var gl = this.renderer.gl;
      var maxTextures = this.maxTextures;
      this.rectShader = new _TiledTileShader__WEBPACK_IMPORTED_MODULE_0__["default"](gl, maxTextures, false);
      this.squareShader = new _TiledTileShader__WEBPACK_IMPORTED_MODULE_0__["default"](gl, maxTextures, true);
      this.checkIndexBuffer(2000);
      this.rectShader.indexBuffer = this.indexBuffer;
      this.squareShader.indexBuffer = this.indexBuffer;
      this.vbs = {};
      this.glTextures = [];
      this.boundSprites = [];
      this.initBounds();
    }
  }]);

  return TiledTileRenderer;
}(PIXI.tilemap.TileRenderer);

PIXI.WebGLRenderer.registerPlugin('tilemap', TiledTileRenderer);

/***/ }),

/***/ "./src/TiledTileShader.js":
/*!********************************!*\
  !*** ./src/TiledTileShader.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TiledTileShader; });
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var GLBuffer = PIXI.glCore.GLBuffer;
var VertexArrayObject = PIXI.glCore.VertexArrayObject;
var squareShaderFrag = "\nvarying vec2 vTextureCoord;\nvarying float vSize;\nvarying float vTextureId;\n\nuniform vec4 shadowColor;\nuniform sampler2D uSamplers[%count%];\nuniform vec2 uSamplerSize[%count%];\nuniform vec2 pointScale;\nuniform float uAlpha;\n\nvoid main(void){\n   float margin = 0.5 / vSize;\n   vec2 pointCoord = (gl_PointCoord - 0.5) * pointScale + 0.5;\n   vec2 clamped = vec2(clamp(pointCoord.x, margin, 1.0 - margin), clamp(pointCoord.y, margin, 1.0 - margin));\n   vec2 textureCoord = pointCoord * vSize + vTextureCoord;\n   float textureId = vTextureId;\n   vec4 color;\n   %forloop%\n   gl_FragColor = color * uAlpha;\n}\n";
var squareShaderVert = "\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec2 aAnim;\nattribute float aTextureId;\nattribute float aSize;\n\nuniform mat3 projectionMatrix;\nuniform vec2 samplerSize;\nuniform vec2 animationFrame;\nuniform float projectionScale;\n\nvarying vec2 vTextureCoord;\nvarying float vSize;\nvarying float vTextureId;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition + aSize * 0.5, 1.0)).xy, 0.0, 1.0);\n   gl_PointSize = aSize * projectionScale;\n   vTextureCoord = aTextureCoord + aAnim * animationFrame;\n   vTextureId = aTextureId;\n   vSize = aSize;\n}\n";
var rectShaderFrag = "\nvarying vec2 vTextureCoord;\nvarying vec4 vFrame;\nvarying float vTextureId;\nuniform vec4 shadowColor;\nuniform sampler2D uSamplers[%count%];\nuniform vec2 uSamplerSize[%count%];\nuniform float uAlpha;\nvoid main(void){\n   vec2 textureCoord = clamp(vTextureCoord, vFrame.xy, vFrame.zw);\n   float textureId = floor(vTextureId + 0.5);\n   vec4 color;\n   %forloop%\n   gl_FragColor = color * uAlpha;\n}\n";
var rectShaderVert = "\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aFrame;\nattribute vec2 aAnim;\nattribute float aTextureId;\nuniform mat3 projectionMatrix;\nuniform vec2 animationFrame;\nvarying vec2 vTextureCoord;\nvarying float vTextureId;\nvarying vec4 vFrame;\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vec2 anim = aAnim * animationFrame;\n   vTextureCoord = aTextureCoord + anim;\n   vFrame = aFrame + vec4(anim, anim);\n   vTextureId = aTextureId;\n}\n";

var TiledTileShader = /*#__PURE__*/function (_PIXI$tilemap$Tilemap) {
  _inherits(TiledTileShader, _PIXI$tilemap$Tilemap);

  var _super = _createSuper(TiledTileShader);

  function TiledTileShader(gl, maxTextures, useSquare) {
    var _this;

    _classCallCheck(this, TiledTileShader);

    var vert = useSquare ? squareShaderVert : rectShaderVert;
    var frag = useSquare ? squareShaderFrag : rectShaderFrag;
    _this = _super.call(this, gl, maxTextures, vert, PIXI.tilemap.shaderGenerator.generateFragmentSrc(maxTextures, frag));

    if (useSquare) {
      _this.vertSize = 8;
      _this.vertPerQuad = 1;
      _this.anim = 5;
      _this.textureId = 7;
    } else {
      _this.vertSize = 11;
      _this.vertPerQuad = 4;
      _this.anim = 8;
      _this.textureId = 10;
    }

    _this.maxTextures = maxTextures;
    _this.stride = _this.vertSize * 4;
    _this.useSquare = useSquare;
    PIXI.tilemap.shaderGenerator.fillSamplers(_assertThisInitialized(_this), _this.maxTextures);
    return _this;
  }

  _createClass(TiledTileShader, [{
    key: "createVao",
    value: function createVao(renderer, vb) {
      return this.useSquare ? this.createVaoSquare(renderer, vb) : this.createVaoRect(renderer, vb);
    }
  }, {
    key: "createVaoRect",
    value: function createVaoRect(renderer, vb) {
      var gl = renderer.gl;
      return renderer.createVao().addIndex(this.indexBuffer).addAttribute(vb, this.attributes.aVertexPosition, gl.FLOAT, false, this.stride, 0).addAttribute(vb, this.attributes.aTextureCoord, gl.FLOAT, false, this.stride, 2 * 4).addAttribute(vb, this.attributes.aFrame, gl.FLOAT, false, this.stride, 4 * 4).addAttribute(vb, this.attributes.aAnim, gl.FLOAT, false, this.stride, this.anim * 4).addAttribute(vb, this.attributes.aTextureId, gl.FLOAT, false, this.stride, this.textureId * 4);
    }
  }, {
    key: "createVaoSquare",
    value: function createVaoSquare(renderer, vb) {
      var gl = renderer.gl;
      return renderer.createVao().addIndex(this.indexBuffer).addAttribute(vb, this.attributes.aVertexPosition, gl.FLOAT, false, this.stride, 0).addAttribute(vb, this.attributes.aTextureCoord, gl.FLOAT, false, this.stride, 2 * 4).addAttribute(vb, this.attributes.aSize, gl.FLOAT, false, this.stride, 4 * 4).addAttribute(vb, this.attributes.aAnim, gl.FLOAT, false, this.stride, 5 * 4).addAttribute(vb, this.attributes.aTextureId, gl.FLOAT, false, this.stride, 7 * 4);
    }
  }]);

  return TiledTileShader;
}(PIXI.tilemap.TilemapShader);



/***/ }),

/***/ "./src/TiledTilemap/index.js":
/*!***********************************!*\
  !*** ./src/TiledTilemap/index.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TiledTilemap; });
/* harmony import */ var _TiledTileLayer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TiledTileLayer */ "./src/TiledTileLayer.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }


var pluginParams = PluginManager.parameters("YED_Tiled");
/**
 * This class handles the tilemap
 */

var TiledTilemap = /*#__PURE__*/function (_ShaderTilemap) {
  _inherits(TiledTilemap, _ShaderTilemap);

  var _super = _createSuper(TiledTilemap);

  function TiledTilemap() {
    _classCallCheck(this, TiledTilemap);

    return _super.apply(this, arguments);
  }

  _createClass(TiledTilemap, [{
    key: "initialize",
    value: function initialize(tiledData, layers) {
      this.indexedBitmaps = [];
      this._tiledData = {};
      this._layers = [];
      this._imageLayers = [];
      this._objectTiles = [];
      this._priorityTiles = [];
      this._priorityTilesCount = 0;
      this.tiledData = tiledData;
      this.layers = layers;

      _get(_getPrototypeOf(TiledTilemap.prototype), "initialize", this).call(this);

      this.setupTiled();
    }
  }, {
    key: "setupTiled",
    value: function setupTiled() {
      this._setupSize();

      this._setupAnim();
    }
  }, {
    key: "_setupSize",
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
    key: "_setupAnim",
    value: function _setupAnim() {
      this._animFrame = {};
      this._animDuration = {};
    }
  }, {
    key: "_createLayers",
    value: function _createLayers() {
      var id = 0;
      this._needsRepaint = true;
      var parameters = PluginManager.parameters('ShaderTilemap');
      var useSquareShader = Number(parameters.hasOwnProperty('squareShader') ? parameters['squareShader'] : 1);

      var _iterator = _createForOfIteratorHelper(this.tiledData.layers),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var layerData = _step.value;
          var zIndex = 0;

          if (layerData.type === "imagelayer") {
            this._createImageLayer(id);

            id++;
            continue;
          }

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

          var layer = new _TiledTileLayer__WEBPACK_IMPORTED_MODULE_0__["default"](zIndex, [], useSquareShader, 32);
          layer.layerId = id; // @dryami: hack layer index

          layer.spriteId = Sprite._counter++;
          layer.alpha = layerData.opacity;

          this._layers.push(layer);

          this.addChild(layer);
          id++;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this._createPriorityTiles();
    }
  }, {
    key: "_createPriorityTiles",
    value: function _createPriorityTiles() {
      var size = parseInt(pluginParams["Priority Tiles Limit"]);
      var zIndex = parseInt(pluginParams["Z - Player"]);

      if (size > 0) {
        var _iterator2 = _createForOfIteratorHelper(Array(size).keys()),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var x = _step2.value;
            var sprite = new Sprite_TiledPriorityTile();
            sprite.z = sprite.zIndex = zIndex;
            sprite.layerId = -1;
            sprite.hide();
            this.addChild(sprite);

            this._priorityTiles.push(sprite);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }
  }, {
    key: "_hackRenderer",
    value: function _hackRenderer(renderer) {
      return renderer;
    }
  }, {
    key: "refreshTileset",
    value: function refreshTileset() {
      var bitmaps = this.indexedBitmaps.map(function (x) {
        if (Array.isArray(x)) {
          return x.map(function (y) {
            return y._baseTexture ? new PIXI.Texture(y._baseTexture) : y;
          });
        }

        return x._baseTexture ? new PIXI.Texture(x._baseTexture) : x;
      });

      var _iterator3 = _createForOfIteratorHelper(this._layers),
          _step3;

      try {
        var _loop = function _loop() {
          var layer = _step3.value;
          var props = $gameMap.getLayerProperties(layer.layerId);
          var tilesetBitmaps = [];

          if (!props.tilesets) {
            return "continue";
          }

          props.tilesets.forEach(function (tilesetId) {
            tilesetBitmaps.push(bitmaps[tilesetId]);
          });
          layer.setBitmaps(tilesetBitmaps);
        };

        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _ret = _loop();

          if (_ret === "continue") continue;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "update",
    value: function update() {
      _get(_getPrototypeOf(TiledTilemap.prototype), "update", this).call(this);

      this._updateAnim();
    }
  }, {
    key: "_updateAnim",
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
    key: "_updateLayerPositions",
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

      var _iterator4 = _createForOfIteratorHelper(this._layers),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var layer = _step4.value;
          var layerData = this.tiledData.layers[layer.layerId];
          var offsetX = layerData.offsetx || 0;
          var offsetY = layerData.offsety || 0;
          layer.position.x = startX * this._tileWidth - ox + offsetX;
          layer.position.y = startY * this._tileHeight - oy + offsetY;
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      var _iterator5 = _createForOfIteratorHelper(this._priorityTiles),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var sprite = _step5.value;
          var _layerData = this.tiledData.layers[sprite.layerId];

          var _offsetX = _layerData ? _layerData.offsetx || 0 : 0;

          var _offsetY = _layerData ? _layerData.offsety || 0 : 0;

          sprite.x = sprite.origX + startX * this._tileWidth - ox + _offsetX + sprite.width / 2;
          sprite.y = sprite.origY + startY * this._tileHeight - oy + _offsetY + sprite.height;
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  }, {
    key: "_paintAllTiles",
    value: function _paintAllTiles(startX, startY) {
      this._priorityTilesCount = 0;

      var _iterator6 = _createForOfIteratorHelper(this._layers),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var layer = _step6.value;
          layer.clear();

          this._paintTiles(layer, startX, startY);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      var id = 0;

      var _iterator7 = _createForOfIteratorHelper(this.tiledData.layers),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var layerData = _step7.value;

          if (layerData.type != "objectgroup") {
            id++;
            continue;
          }

          this._paintObjectLayers(id, startX, startY);

          id++;
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      while (this._priorityTilesCount < this._priorityTiles.length) {
        var sprite = this._priorityTiles[this._priorityTilesCount];
        sprite.hide();
        sprite.layerId = -1;
        this._priorityTilesCount++;
      }
    }
  }, {
    key: "_paintTiles",
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
    key: "_paintObjectLayers",
    value: function _paintObjectLayers(layerId, startX, startY) {
      var layerData = this.tiledData.layers[layerId];
      var objects = layerData.objects || [];

      var _iterator8 = _createForOfIteratorHelper(objects),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var obj = _step8.value;

          if (!obj.gid) {
            continue;
          }

          if (!obj.visible) {
            continue;
          }

          var tileId = obj.gid;
          var realTileId = tileId & 0x1FFFFFFF;

          var textureId = this._getTextureId(realTileId);

          var offsets = $gameMap.offsets();
          var dx = obj.x - (startX + offsets.x) * this._tileWidth;
          var dy = obj.y - (startY + offsets.y) * this._tileHeight - obj.height;
          var positionHeight = 0;
          var zIndex = false;

          if (obj.properties) {
            if (obj.properties.positionHeight) {
              positionHeight = obj.properties.positionHeight;
            }

            if (obj.properties.hasOwnProperty('zIndex')) {
              zIndex = obj.properties.zIndex;
            }
          }

          this._paintPriorityTile(layerId, textureId, tileId, startX, startY, dx, dy, positionHeight, zIndex);
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    }
  }, {
    key: "_paintTilesLayer",
    value: function _paintTilesLayer(layer, startX, startY) {
      var tileCols = Math.ceil(this._width / this._tileWidth) + 1;
      var tileRows = Math.ceil(this._height / this._tileHeight) + 1;

      var _iterator9 = _createForOfIteratorHelper(Array(tileRows).keys()),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var y = _step9.value;

          var _iterator10 = _createForOfIteratorHelper(Array(tileCols).keys()),
              _step10;

          try {
            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
              var x = _step10.value;

              this._paintTile(layer, startX, startY, x, y);
            }
          } catch (err) {
            _iterator10.e(err);
          } finally {
            _iterator10.f();
          }
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
    }
  }, {
    key: "_paintTile",
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
      var tileId = TiledManager.extractTileId(this.tiledData.layers[layer.layerId], tilePosition);
      var rectLayer = layer.children[0];
      var textureId = 0;
      var props = $gameMap.getLayerProperties(layer.layerId);

      if (!tileId) {
        return;
      } // TODO: Problem with offsets


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

      if (props.tilesets && props.tilesets.indexOf(textureId) > -1) {
        textureId = props.tilesets.indexOf(textureId);
      }

      rectLayer.addRect(textureId, ux, uy, dx, dy, w, h);
    }
  }, {
    key: "_paintPriorityTile",
    value: function _paintPriorityTile(layerId, textureId, tileId, startX, startY, dx, dy) {
      var positionHeight = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
      var zIndex = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : false;
      var tileset = this.tiledData.tilesets[textureId];
      var tileOrientation = tileId >> 24 & 0xe0;
      var realTileId = tileId & 0x1FFFFFFF;
      var tile = tileset.tiles ? tileset.tiles[realTileId - tileset.firstgid] || {} : {};
      var w = tile.imagewidth || tileset.tilewidth;
      var h = tile.imageheight || tileset.tileheight;
      var tileCols = tileset.columns;

      var rId = this._getAnimTileId(textureId, realTileId - tileset.firstgid);

      var ux = rId % tileCols * w;
      var uy = Math.floor(rId / tileCols) * h;
      var sprite = this._priorityTiles[this._priorityTilesCount];
      var layerData = this.tiledData.layers[layerId];
      var offsetX = layerData ? layerData.offsetx || 0 : 0;
      var offsetY = layerData ? layerData.offsety || 0 : 0;
      var ox = 0;
      var oy = 0;
      var flipH = tileOrientation === 0x20 || (tileOrientation & 0x80) > 0;
      var flipV = tileOrientation === 0x20 || (tileOrientation & 0x40) > 0;

      if (this.roundPixels) {
        ox = Math.floor(this.origin.x);
        oy = Math.floor(this.origin.y);
      } else {
        ox = this.origin.x;
        oy = this.origin.y;
      }

      var size = parseInt(pluginParams["Priority Tiles Limit"]);

      if (this._priorityTilesCount >= this._priorityTiles.length) {
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
      sprite.anchor.y = flipV ? 0.0 : 1.0;
      sprite.origX = dx;
      sprite.origY = dy;
      sprite.scale.x = flipH ? -1 : 1;
      sprite.scale.y = flipV ? -1 : 1;
      sprite.x = sprite.origX + startX * this._tileWidth - ox + offsetX + w / 2;
      sprite.y = sprite.origY + startY * this._tileHeight - oy + offsetY + h;

      var realTextureId = this._getTextureId(realTileId, true);

      if (Array.isArray(this.indexedBitmaps[realTextureId])) {
        var tile = tileset.tiles[realTileId - tileset.firstgid];
        sprite.bitmap = this.indexedBitmaps[realTextureId][realTileId - tileset.firstgid];
        sprite.setFrame(0, 0, tile.imagewidth, tile.imageheight);
      } else {
        sprite.bitmap = this.indexedBitmaps[realTextureId];
        sprite.setFrame(ux, uy, w, h);
      }

      sprite.priority = this._getPriority(layerId);
      sprite.z = sprite.zIndex = zIndex !== false ? zIndex : this._getZIndex(layerId);
      sprite.positionHeight = positionHeight;
      sprite.show();
      this._priorityTilesCount += 1;
    }
  }, {
    key: "_getTextureId",
    value: function _getTextureId(tileId) {
      var ignore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var textureId = 0;

      var _iterator11 = _createForOfIteratorHelper(this.tiledData.tilesets),
          _step11;

      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var tileset = _step11.value;

          if (ignore && tileset.properties && tileset.properties.ignoreLoading) {
            continue;
          }

          if (tileId < tileset.firstgid || tileId >= tileset.firstgid + tileset.tilecount) {
            textureId++;
            continue;
          }

          break;
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }

      return textureId;
    }
  }, {
    key: "_getAnimTileId",
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
    key: "_getPriority",
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
    key: "_isPriorityTile",
    value: function _isPriorityTile(layerId) {
      var playerZIndex = parseInt(pluginParams["Z - Player"]);

      var zIndex = this._getZIndex(layerId);

      return this._getPriority(layerId) > 0 && zIndex === playerZIndex;
    }
  }, {
    key: "_getZIndex",
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
    /**
     * Hides a layer based on the level the player is on
     * 
     * This method has been deprecated in favor of the more general method.
     */

  }, {
    key: "hideOnLevel",
    value: function hideOnLevel(level) {
      var layerIds = [];

      var _iterator12 = _createForOfIteratorHelper(this._layers),
          _step12;

      try {
        for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
          var layer = _step12.value;
          var layerData = this.tiledData.layers[layer.layerId];

          if (layerData.properties && layerData.properties.hasOwnProperty("hideOnLevel")) {
            if (parseInt(layerData.properties.hideOnLevel) !== level) {
              if (layer.transition) {
                /* If this layer has a transition, we'll need to tell the layer that
                   it's supposed to be showing. */
                layer.isShown = true;
              }

              this.addChild(layer);
              continue;
            }
            /* Since the layer is supposed to be hidden, let's first let it transition if
               it has a transition fadeout. */


            if (layer.transition) {
              layer.isShown = false;

              if (layer.minAlpha > 0 || layer.transitionStep > 0) {
                this.addChild(layer);
                continue;
              }
            }
            /* Otherwise remove the layer and hide it */


            layerIds.push(layer.layerId);
            this.removeChild(layer);
          }
        }
      } catch (err) {
        _iterator12.e(err);
      } finally {
        _iterator12.f();
      }

      this._priorityTiles.forEach(function (sprite) {
        if (layerIds.indexOf(sprite.layerId) > -1) {
          sprite.visible = true;
        }
      });
    }
    /**
     * Hides layers on certain special conditions
     * 
     * This method will analyze each layer, then checks them with certain conditions. If
     * they meet one condition, they will be hidden.
     * 
     * It also handles fading in and out layers.
     */

  }, {
    key: "hideOnSpecial",
    value: function hideOnSpecial() {
      /* Iterates through each layer */
      var _iterator13 = _createForOfIteratorHelper(this._layers),
          _step13;

      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var layer = _step13.value;
          var layerData = this.tiledData.layers[layer.layerId];

          if (layerData.properties) {
            var hideLayer = TiledManager.checkLayerHidden(layerData);
            /* If the layer has a hide property, run this code.
             * You don't need to run it for layers that don't have any properties that would
               hide this layer. */

            if (TiledManager.hasHideProperties(layerData)) {
              /* If the layer isn't supposed to be hidden, add the layer to the container */
              var props = $gameMap.getLayerProperties(layer.layerId);

              if (!hideLayer) {
                if (props.transition) {
                  /* If this layer has a transition, we'll need to tell the layer that
                     it's supposed to be showing. */
                  props.isShown = true;
                }

                this.addChild(layer);
                continue;
              }
              /* Since the layer is supposed to be hidden, let's first let it transition if
                 it has a transition fadeout. */


              if (props.transition) {
                props.isShown = false;

                if (props.minAlpha > 0 || props.transitionPhase > 0) {
                  this.addChild(layer);
                  continue;
                }
              }
              /* Otherwise remove the layer and hide it */


              this.removeChild(layer);
            }
          }
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }
    }
  }, {
    key: "_compareChildOrder",
    value: function _compareChildOrder(a, b) {
      if ((this._layers.indexOf(a) > -1 || this._imageLayers.indexOf(a) > -1) && (this._layers.indexOf(b) > -1 || this._imageLayers.indexOf(b) > -1)) {
        if ((a.z || 0) !== (b.z || 0)) {
          return (a.z || 0) - (b.z || 0);
        } else if ((a.priority || 0) !== (b.priority || 0)) {
          return (a.priority || 0) - (b.priority || 0);
        } else if ((a.layerId || 0) !== (b.layerId || 0)) {
          return (a.layerId || 0) - (b.layerId || 0);
        } else {
          return a.spriteId - b.spriteId;
        }
      } else if ((a.z || 0) !== (b.z || 0)) {
        return (a.z || 0) - (b.z || 0);
      } else if ((a.y || 0) + (a.positionHeight || 0) !== (b.y || 0) + (b.positionHeight || 0)) {
        return (a.y || 0) + (a.positionHeight || 0) - ((b.y || 0) + (b.positionHeight || 0));
      } else if ((a.priority || 0) !== (b.priority || 0)) {
        return (a.priority || 0) - (b.priority || 0);
      } else {
        return a.spriteId - b.spriteId;
      }
    }
    /* Parallax map stuff */

  }, {
    key: "_createImageLayer",
    value: function _createImageLayer(id) {
      var imageLayer = this.layers[id];

      if (imageLayer.ignoreLoading) {
        return;
      }

      var props = $gameMap.getLayerProperties(id);
      var repeatX = imageLayer.repeatX;
      var repeatY = imageLayer.repeatY;
      var autoX = imageLayer.autoX;
      var autoY = imageLayer.autoY;
      var viewportWidth = imageLayer.viewportWidth;
      var viewportHeight = imageLayer.viewportHeight;
      var layer;

      if (!repeatX && !repeatY && !autoX && !autoY) {
        layer = new Sprite_Base();
      } else {
        layer = new TilingSprite();
        layer.move(0, 0, Graphics.width, Graphics.height);
      }

      layer.layerId = id;
      layer.spriteId = Sprite._counter++;
      layer.alpha = imageLayer.opacity;
      layer.bitmap = ImageManager.loadParserParallax(imageLayer.image, imageLayer.hue);
      layer.bitmap.addLoadListener(function () {
        props.imageWidth = layer.bitmap.width;
        props.imageHeight = layer.bitmap.height;
      });
      layer.baseX = imageLayer.baseX;
      layer.baseY = imageLayer.baseY;
      layer.z = imageLayer.z;
      layer.repeatX = repeatX;
      layer.repeatY = repeatY;
      layer.deltaX = imageLayer.deltaX;
      layer.deltaY = imageLayer.deltaY;
      layer.stepAutoX = autoX;
      layer.stepAutoY = autoY;
      layer.autoX = 0;
      layer.autoY = 0;

      if (viewportWidth || viewportHeight) {
        viewportWidth = viewportWidth || Graphics.width;
        viewportHeight = viewportHeight || Graphics.height;
        var layerMask = new PIXI.Graphics();
        layerMask.baseX = imageLayer.viewportX;
        layerMask.baseY = imageLayer.viewportY;
        layerMask.baseWidth = imageLayer.viewportWidth;
        layerMask.baseHeight = imageLayer.viewportHeight;
        layerMask.deltaX = imageLayer.viewportDeltaX;
        layerMask.deltaY = imageLayer.viewportDeltaY;
        layer.mask = layerMask;
        layer.hasViewport = true;
        console.log(layer, layerMask, imageLayer, this.tiledData.layers[id]);
      }

      this._imageLayers.push(layer);

      this.addChild(layer);
    }
  }, {
    key: "updateImageLayer",
    value: function updateImageLayer() {
      var _this = this;

      this._imageLayers.forEach(function (layer) {
        var layerData = _this.tiledData.layers[layer.layerId];
        var props = $gameMap.getLayerProperties(layer.layerId);

        if (TiledManager.hasHideProperties(layerData)) {
          var visibility = TiledManager.checkLayerHidden(layerData);

          if (props.transition) {
            layer.alpha = (props.baseAlpha - props.minAlpha) * (props.transitionPhase / props.transition) + props.minAlpha;
            visibility = props.minAlpha > 0 || props.transitionPhase > 0;
          }

          layer.visible = visibility;
        }

        var offsets = $gameMap.offsets();
        offsets.x *= $gameMap.tileWidth();
        offsets.y *= $gameMap.tileHeight();
        var display = {
          x: $gameMap.displayX() * $gameMap.tileWidth(),
          y: $gameMap.displayY() * $gameMap.tileHeight()
        };

        if (!!layer.origin) {
          var autoX = props.autoXFunction ? props.autoXFunction(props.autoX, props.autoY || 0) : 0;
          var autoY = props.autoYFunction ? props.autoYFunction(props.autoX || 0, props.autoY) : 0;

          if (!layer.repeatX) {
            layer.origin.x = layer.baseX - offsets.x + autoX;
            layer.x = layer.baseX - offsets.x - display.x * layer.deltaX;
            layer.width = layer.bitmap.width;
          } else {
            layer.origin.x = layer.baseX - offsets.x + autoX + display.x * layer.deltaX;
            layer.x = 0;
            layer.width = Graphics.width;
          }

          if (!layer.repeatY) {
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

        if (layer.hasViewport) {
          var viewportX = layer.mask.baseX - offsets.x - display.x * layer.mask.deltaX;
          var viewportY = layer.mask.baseY - offsets.y - display.y * layer.mask.deltaY;
          layer.mask.clear();
          layer.mask.beginFill(0xffffff, 1);
          layer.mask.drawRect(viewportX, viewportY, layer.mask.baseWidth, layer.mask.baseHeight);
        }
      });
    }
  }, {
    key: "tiledData",
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

/***/ "./src/TilesetManager.js":
/*!*******************************!*\
  !*** ./src/TilesetManager.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

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
  xhr.overrideMimeType('application/json'); // on success callback

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
  }; // send request


  xhr.send();
};

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TilesetManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TilesetManager */ "./src/TilesetManager.js");
/* harmony import */ var _TilesetManager__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_TilesetManager__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _DataManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DataManager */ "./src/DataManager.js");
/* harmony import */ var _DataManager__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_DataManager__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ImageManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ImageManager */ "./src/ImageManager.js");
/* harmony import */ var _ImageManager__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_ImageManager__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _TiledManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TiledManager */ "./src/TiledManager.js");
/* harmony import */ var _TiledManager__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_TiledManager__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Sprite_TiledPriorityTile__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Sprite_TiledPriorityTile */ "./src/Sprite_TiledPriorityTile.js");
/* harmony import */ var _Sprite_TiledPriorityTile__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_Sprite_TiledPriorityTile__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _AlphaFilter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AlphaFilter */ "./src/AlphaFilter.js");
/* harmony import */ var _AlphaFilter__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_AlphaFilter__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _TiledTileRenderer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./TiledTileRenderer */ "./src/TiledTileRenderer.js");
/* harmony import */ var _Game_Map__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Game_Map */ "./src/Game_Map.js");
/* harmony import */ var _Game_Screen__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Game_Screen */ "./src/Game_Screen.js");
/* harmony import */ var _Game_Screen__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_Game_Screen__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _Game_CharacterBase__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Game_CharacterBase */ "./src/Game_CharacterBase.js");
/* harmony import */ var _Game_CharacterBase__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_Game_CharacterBase__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _Game_Actor__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Game_Actor */ "./src/Game_Actor.js");
/* harmony import */ var _Game_Actor__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_Game_Actor__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _Game_Player__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Game_Player */ "./src/Game_Player.js");
/* harmony import */ var _Game_Player__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_Game_Player__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _Game_Vehicle__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Game_Vehicle */ "./src/Game_Vehicle.js");
/* harmony import */ var _Game_Vehicle__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_Game_Vehicle__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _Game_Interpreter__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Game_Interpreter */ "./src/Game_Interpreter.js");
/* harmony import */ var _Game_Interpreter__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_Game_Interpreter__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _Sprite_Character__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./Sprite_Character */ "./src/Sprite_Character.js");
/* harmony import */ var _Sprite_Character__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_Sprite_Character__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _Spriteset_Map__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./Spriteset_Map */ "./src/Spriteset_Map.js");
















/* INITIALIZES LISTENERS */
// Add floor damage while on a slippery floor

TiledManager.addListener(Game_Player, 'slipperyfloor', function (options) {
  var d = options.direction;
  $gameParty.members().forEach(function (actor) {
    actor.checkFloorEffect();
  });
  this.moveStraight(d);
});
/* INITIALIZES HIDE FUNCTIONS */

TiledManager.addHideFunction('hideOnLevel', function (layerData) {
  /* Hide if player is on certain level */
  var level = $gameMap.currentMapLevel;
  var hideLayer = false;

  if (parseInt(layerData.properties.hideOnLevel) === level) {
    hideLayer = true;
  }

  return hideLayer;
});
TiledManager.addHideFunction('showOnLevel', function (layerData) {
  /* Show if player is on certain level */
  var level = $gameMap.currentMapLevel;
  var hideLayer = false;

  if (parseInt(layerData.properties.showOnLevel) !== level) {
    hideLayer = true;
  }

  return hideLayer;
});
TiledManager.addHideFunction('hideOnRegion', function (layerData) {
  /* Hide if player is on certain region */
  var regionId = $gamePlayer.regionId();
  var hideLayer = false;

  if (parseInt(layerData.properties.hideOnRegion) === regionId) {
    hideLayer = true;
  }

  return hideLayer;
}, ['regions']);
TiledManager.addHideFunction('hideOnRegions', function (layerData) {
  /* Hide if player is on certain region */
  var regionId = $gamePlayer.regionId();
  var hideLayer = false;

  if (layerData.properties.hideOnRegions.split(',').indexOf(String(regionId)) !== -1) {
    hideLayer = true;
  }

  return hideLayer;
}, ['regions']);
TiledManager.addHideFunction('hideOnAnyRegions', function (layerData) {
  /* Hide if player is on certain region */
  var regionIds = $gamePlayer.regionIds();
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

  if (!$gameSwitches.value(layerData.properties.showOnSwitch)) {
    hideLayer = true;
  }

  return hideLayer;
});
/* INITIALIZES FLAGS */

TiledManager.addFlag('boat', 'ship', 'airship');
TiledManager.addFlag('ladder', 'bush', 'counter', 'damage');
TiledManager.addFlag('ice', 'autoDown', 'autoLeft', 'autoRight', 'autoUp');
TiledManager.addFlag('heal');
/* INITIALIZES VEHICLES */

TiledManager.createVehicle('boat', true);
TiledManager.createVehicle('ship', true);
TiledManager.createVehicle('airship', true);
/* INITIALIZES AUTO FUNCTIONS */

TiledManager.setAutoFunction('linear', {
  x: function x(_x, y) {
    return _x;
  },
  y: function y(x, _y) {
    return _y;
  }
});
TiledManager.setAutoFunction('sine', {
  x: function x(_x2, y) {
    return Math.sin(_x2 * Math.PI / 180);
  },
  y: function y(x, _y2) {
    return Math.sin(_y2 * Math.PI / 180);
  }
});
TiledManager.setAutoFunction('cosine', {
  x: function x(_x3, y) {
    return Math.cos(_x3 * Math.PI / 180);
  },
  y: function y(x, _y3) {
    return Math.cos(_y3 * Math.PI / 180);
  }
});
TiledManager.registerStandardResolvers();
/* INITIALIZES PLUGIN COMMANDS */

TiledManager.addPluginCommand('TiledTransferPlayer', function (args) {
  var mapId = parseInt(args[0]);
  var waypoint = args[1];
  var direction = args.length > 2 ? args[2] : 0;
  var fadeType = args.length > 3 ? args[3] : 2;

  if (isNaN(direction)) {
    switch (direction.toLowerCase()) {
      case 'down':
        direction = 2;
        break;

      case 'left':
        direction = 4;
        break;

      case 'right':
        direction = 6;
        break;

      case 'up':
        direction = 8;
        break;

      default:
        direction = 0;
        break;
    }
  } else {
    direction = parseInt(direction);
  }

  if (isNaN(fadeType)) {
    // Fix by FrillyWumpus
    switch (fadeType.toLowerCase()) {
      case 'black':
        fadeType = 0;
        break;

      case 'white':
        fadeType = 1;
        break;

      default:
        fadeType = 2;
        break;
    }
  } else {
    fadeType = parseInt(fadeType);
  }

  $gamePlayer.reserveTransfer(mapId, 0, 0, direction, fadeType, waypoint);
  this.setWaitMode('transfer');
});
TiledManager.addPluginCommand('TiledSetLevel', function (args) {
  $gameMap.currentMapLevel = parseInt(args[0]);
});
/* LOAD CUSTOM DATA FROM THE PARAMTERS */

TiledManager.getParameterFlags();
TiledManager.getParameterVehicles();

/***/ })

/******/ });
//# sourceMappingURL=YED_Tiled.js.map