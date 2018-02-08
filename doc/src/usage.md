# Usage

Just put this script as high as possible, preferably before plugins that
extend functionality of maps and rendering thereof, but after any plugin
that rewrites map handling. Ideally, you'd only have to use this plugin for
any of your mapping needs.

Note that the Tiled plugin handles the following:
 * Map layouts and rendering
 * Regions
 * Collisions
 * Parallax images

Note that this guide won't explain how to use Tiled itself, this will only
go over the plugin specific features.

## Starting your project

After you've added the Tiled plugin you may want to start creating your
Tiled maps. Make sure you make these maps in your game folder, so that any
direct references to images will work right off the box.

The first thing you'll need to do is to create a map inside RPG Maker MV.
By default, you'll already have a map with map ID 1, so when you start off,
you can just use that map. Now, create a new map in Tiled. Make sure its
orientation is Orthogonal, and the map is saved as a comma separated value
(CSV).

Next, save your map as a json file. Call it Map, followed by the ID, but not
zero padded. For example, if your map ID is 1, save your Tiled map as
Map1.json. Make sure you directly save it in the folder you defined in your
plugin settings (Maps Location). And with that, you've set up your first
map in Tiled.

## Infinite maps vs. fixed size maps

Tiled has two types of maps, infinite maps and fixed size maps. They are
essentially similar in use, with one difference, which is that infinite maps
don't have a fixed size. In the Tiled plugin, both maps are treated the
same, though, with infinite maps having their size determined by the
sizes defined inside the Tiled map format.

This means that infinite maps may appear smaller or cut off than what they
are supposed to look like. To fix this, you could preset the sizes by
manually setting the size. Your map will remain an infinite map, but you'll
now have a bit more flexibility with how the map is shaped in the final
product.

It's still recommended to convert infinite maps to fixed size maps, as the
pre-processing phase will be skipped, allowing for faster map loading.

## Layers

Like stated before, with this plugin you can use practically unlimited
layers. By default, a layer has no z-index, which means it'll always be at
the bottom, or stacked on top of other layers and objects with no z-index.
You can also specify a custom z-index by adding a property zIndex. If the
z-index is lower than that of the player, it will render below the player,
if the z-index is higher than the player, though, it will render above.

## Tilesets

By default, RPG Maker MV tilesets won't work in Tiled, since autotiles
aren't implemented. However, there is a tool that can convert RPG Maker MV
tilesets so that it can be used in Tiled, called Remex.

https://app.assembla.com/spaces/rpg-maker-to-tiled-suite/subversion/source

When importing tilesets, you have the option of embedding the tileset data
inside the map itself, or saving it in a separate file. Make sure that when
you do the latter, you'll have to save it as a json file, and you'll have to
put it in the folder specified in the plugin configuration, under
Tilesets Location.

## Events

Setting up events is easy, although it does require you to actually still use
RPG Maker MV, as you'll be setting up your events here. Like maps, each event
has its own ID. To retrieve its ID, you'll have to select your event, and in
the bottom right corner of the RPG Maker MV editor, you'll see the event ID as
well as its name, for example, 001:EV001.

Next, you'll need to create a new object in Tiled. Create a new Object layer,
and create a new rectangular object. You could in theory use a different shape,
but since events generally are rectangular, you want to make sure your object
is the same shape as a tile. Also, if Constrain Events to Grid is set to true,
the objects will automatically snap to the grid, so, if you don't want your
event to appear somewhere you didn't intend it to be, make sure you snap to
grid.

Now, to make it all work, all you need to do is give this object a property
eventId and set the event ID as the value. This will move the event to the
proper map location.

## Vehicles

You can add vehicles in the same way as events, except you don't have to place
the vehicle in your map. This is because vehicles already are on every map.

To place a vehicle in your map, use the object property vehicle, and set as
the value the name of the vehicle you want to add. You can use "boat", "ship"
or "airship", or any custom made vehicle you have made through plugins.

## Images

Images can now directly be added to Tiled, both as parallax images as well as
regular images. By default, images added through Tiled will act like regular
images, and will be placed in the layer order you've set in the Tiled map.
However, you can add several properties to make images a bit more dynamic. For
example, you can use the same hide functions as for regular layers.

The main feature for images that most would want to use though is parallax
images. To set an image as a parallax, you can set the repeatX and repeatY to
true, so that the image will tile. You can also set a custom scroll speed when
the camera is moving by changing the deltaX and deltaY. A delta of 0 means that
the image stays stationary on that axis, while a delta of 1 makes the image
scroll with the same speed as the player.

## Extra notes on parallax images

While the Tiled plugin has its own handles for parallax images, you can
still use RPG Maker MV's default parallax image functionality, as that will
not be overwritten. This is to give the creators options, in case the Tiled
functionalities are too confusing.

