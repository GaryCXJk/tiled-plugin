# Development hooks

For the Tiled Plugin, several hooks have been created for plugin developers,
so that they could create their own plugin for Tiled without having to
overwrite functionality.

    TiledManager.addListener(objectName, event, callback, recursive = true)

Adds a listener for certain events.

**objectName**  
The name of the object this listener is meant for, for example,
Game\_CharacterBase or Game\_Player.

**event**  
The name of the event it should listen to.

**callback**  
The callback function. This callback function takes exactly one argument,
as the listener will pass an object to this callback.

**recursive**  
Whether the event callback will be triggered recursively. If an object is
derived from another object, like Game\_Player being derived from
Game\_CharacterBase, by default it will also call the callbacks from that
object. When set to false, it will skip the current callback if it's not
directly applied to that object.

    TiledManager.triggerListener(object, event, options = {})

This triggers an event for a certain object.

**object**  
Generally the keyword "this", but you can set any object for which the
callbacks should be called.

**event**  
The name of the event. that should be called.

**options**  
An object that contains properties that can be passed on to the callback.

    TiledManager.addHideFunction(id, callback, ignore = [])

Adds a hide function, a function that hides a layer or image based on
certain rules.

**id**  
The ID of the hide function. This will also be used as a property check
for Tiled maps itself. If there isn't a property of the same name as the
ID, it will not execute the callback.

**callback**  
The callback function that should be run. This should return true if a
layer or image has to be hidden, and false if it should remain visible.

**ignore**  
This is mainly used during calculations, and can be left empty. Essentially
you can add groups that should ignore this function. These groups are:

 * regions
 * collisions
 * levelChanges
 * tileFlags

The only thing it does is making sure functions and methods that belong to
a certain group will ignore this callback.

    TiledManager.checkLayerHidden(layerData, ignore = [])

This will check if a certain layer is hidden.

**layerData**  
The Tiled layer data. Note that this isn't the properties data, but the
entire layer data.

**ignore**  
You can specify here which hide functions it should ignore, as specified in
TiledManager.addHideFunction.

    TiledManager.hasHideProperties(layerData)

Checks whether a layer has hide properties.

**layerData**  
The Tiled layer data. Note that this isn't the properties data, but the
entire layer data.

    TiledManager.addFlag(...flagIds)

Adds a flag or multiple flags.

**flagIds**  
The flag ID you want to add. You can just set multiple of them as multiple
arguments. The flag IDs will be used to check up which bit you need to check,
as well as in the tile property. When setting a tile property using this
flag ID, prepend it with "flagIs" and capitalize the first letter. For
example, if you have a flag ID "monster", you'll use the property
"flagIsMonster".

    TiledManager.getFlag(flagId)

Get the numerical ID of a certain flag.

**flagId**  
The flag ID.

    TiledManager.getFlagNames()

Get a list of all flags.

    TiledManager.getFlagLocation(flagId)

Get an array with the values group and bit. The group is the group in which
the flag bit resides, and the bit is the bit number of that group.

**flagId**  
The flag ID.

    TiledManager.createVehicle(vehicleName, vehicleData = false)

**vehicleName**  
The name of the vehicle.

**vehicleData**  
An object containing the vehicle data. When false, it will take default
values, otherwise, it will take an object. This object has essentially
the same structure as the vehicles inside the System.json file. On top
of that, there are a few extra properties.

    moveSpeed  
The move speed of the vehicle.

    direction  
The initial direction of the vehicle.

    tileFlag  
The tile flag it looks for when looking for passability.

    hasCollision  
Whether the vehicle has collision. When false, you'll have to stand on
top of it to enter.

    resetDirection  
Whether the vehicle has to reset its direction after you exit it.

## Objects and events

These are the objects and their events. Note that events are inherited by
underlying objects, for example, Game\_Character inherits all events from
Game\_CharacterBase.

All elements will pass an object with several properties, which you can
use in your own events.

### Game\_CharacterBase

**stopmovement**  
Triggers when movement is stopped.

    direction  
The direction the character is looking in.

**slipperyfloor**  
Triggers when stepping on a slippery floor tile.

    direction  
The direction the character is looking in.

### Game\_Player

**changelevel**  
Triggers when changing layer levels.

    oldLevel
The old level.

    newLevel
The new level.

### Game\_Map

**changelevel**  
Triggers when changing layer levels.

    oldLevel
The old level.

    newLevel
The new level.

