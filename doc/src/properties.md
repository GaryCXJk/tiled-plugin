# Properties

As explained earlier, several elements in Tiled can have properties that will
interface with the Tiled Plugin.

## Tile layer properties

**zIndex**  
The layer will have z-index equal to the property's value.

**collision**  
The layer will be a collision mask layer. Use one of these value:

 * full - Normal collision (1 full-tile)
 * arrow - Arrow collision
 * up-left - Half-tile collision up-left quarter
 * up-right - Half-tile collision up-right quarter
 * down-left - Half-tile collision down-left quarter
 * down-right - Half-tile collision down-right quarter
 * tiles - Collision is determined by the tileset

**arrowImpassable**  
If the layer is an arraw collision mask layer, it will make one direction be
impassable. Value can be up, down, left or right.

**regionId**  
Mark the layer as region layer, the layer ID will be the value of property.
If set to -1, it will use the tileset to determine the region ID.

**priority**  
Mark the layer as priority layer, allows it goes above player when player is
behind, below player when player is in front of. Value should be greater than
0, zIndex should be the same as player z-index.

Note that this also determines the drawing priority, e.g. layers with the
same z-index and y-position would then be sorted by their priority.

**level**  
Mark the layer on different a level, use for multiple levels map (for example
a bridge). Default level is 0. Use this for collision and regionId.

**toLevel**  
The tiles on this layer will transfer the player to another level.

**tileFlags**  
Set this to true to enable tile flags in the tileset. Set this to "hide" if you
aren't going to draw this layer.

**hideOnLevel**  
Hide the layer when on a certain level.

**showOnLevel**  
Show the layer when on a certain level.

**hideOnRegion**  
Hide the layer when on a certain region.

**hideOnRegions**  
Hide the layer when on a certain region. This takes an array of possible
regions, and the player only needs to be on one of the layers. Each region is
comma separated.

**hideOnAnyRegions**  
Hide the layer when on a certain region. This functions the same as
hideOnRegions, except it will take all regions on that tile instead of just
the top visible region.

**hideOnSwitch**  
Hide the layer when a certain switch is set.

**showOnSwitch**  
Show the layer when a certain switch is set.

**transition**  
This will enable the layer to transition from a shown state to a hidden state.
Set the value as the duration in ticks.

**minimumOpacity**  
The minimum opacity the layer should fade out to.

## Tileset properties

**ignoreLoading**  
Ignores the image, and doesn't load nor render it. Good if you want to mark
certain areas in Tiled for development purposes or mapping notes, but don't
want them to appear in the game.

## Tile properties

**regionId**  
Mark the tile as region, the tile's region ID will be the value of property

**collision**  
Mark the tile as having normal collision (1 full-tile)

**collisionUpLeft**  
Mark the tile as having half-tile collision up-left quarter

**collisionUpRight**  
Mark the tile as having half-tile collision up-right quarter

**collisionDownLeft**  
Mark the tile as having half-tile collision down-left quarter

**collisionDownRight**  
Mark the tile as having half-tile collision down-right quarter

collisionUpLeft, collisionUpRight, collisionDownLeft and collisionDownRight can
be combined to create a custom collision.

**arrowImpassableLeft**  
Make the left direction impassable

**arrowImpassableUp**  
Make the up direction impassable

**arrowImpassableRight**  
Make the right direction impassable

**arrowImpassableDown**  
Make the down direction impassable

arrowImpassableLeft, arrowImpassableUp, arrowImpassableRight and
arrowImpassableDown can be combined to create a custom arrow passability.

**flagIsBoat**  
The tile is passable by boat

**flagIsShip**  
The tile is passable by ship

**flagIsAirship**  
The tile is landable by airship

**flagIsLadder**  
The tile is a ladder

**flagIsBush**  
The tile is a bush or has special bush rendering

**flagIsCounter**  
The tile is a counter (can interact through this tile with another event)

**flagIsDamage**  
The tile is a damage tile (player gets damaged when stepped on)

**flagIsIce**  
The tile is slippery

## Object properties

**eventId**  
The event ID that should be placed at this position.

**vehicle**  
The vehicle that should be placed at this position.

## Image properties

**ignoreLoading**  
Ignores the image, and doesn't load nor render it. Good if you want to mark
certain areas in Tiled for development purposes or mapping notes, but don't
want them to appear in the game.

**zIndex**  
The image will have z-index equal to the property's value.

**repeatX**  
Whether it has to repeat horizontally or not.

**repeatY**
Whether it has to repeat vertically or not.

**deltaX**  
The horizontal movement when the camera moves.

**deltaY**  
The vertical movement when the camera moves.

**autoX**  
Setting this will automatically move the image, depending on the value, in
the horizontal direction.

**autoY**  
Setting this will automatically move the image, depending on the value, in
the vertical direction.

**viewportX**  
The x-coordinate of the viewport.

**viewportY**  
The y-coordinate of the viewport.

**viewportWidth**  
The width of the viewport.

**viewportHeight**  
The height of the viewport.

**viewportDeltaX**  
The horizontal movement of the viewport when the camera moves.

**viewportDeltaY**  
The vertical movement of the viewport when the camera moves.

**hue**  
The hue of the image.

**hideOnLevel**  
Hide the layer when on a certain level.

**showOnLevel**  
Show the layer when on a certain level.

**hideOnRegion**  
Hide the layer when on a certain region.

**hideOnRegions**  
Hide the layer when on a certain region. This takes an array of possible
regions, and the player only needs to be on one of the layers. Each region is
comma separated.

**hideOnAnyRegions**  
Hide the layer when on a certain region. This functions the same as
hideOnRegions, except it will take all regions on that tile instead of just
the top visible region.

**hideOnSwitch**  
Hide the layer when a certain switch is set.

**showOnSwitch**  
Show the layer when a certain switch is set.

**transition**  
This will enable the layer to transition from a shown state to a hidden state.
Set the value as the duration in ticks.

**minimumOpacity**  
The minimum opacity the layer should fade out to.

