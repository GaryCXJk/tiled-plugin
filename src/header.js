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