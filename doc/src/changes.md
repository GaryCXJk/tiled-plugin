# Changes

**v2.02 (2018-05-03)**
Author: Frilly Wumpus

* Added: new event hook for intercepting when each tiled data layer has finished
  processing/unencoding
* Added: new event hook for intercepting once the entire tiled data map has
  been processed
* Added: new ObjectResolver functions to be able to define and
  process custom Tiled objects.
* Fix: Updated `triggerListener` to work with static classes like
  the TileManager

**v2.01 (2018-04-13)**  
* Fix: Crash when using TiledTransferPlayer while using a text string to
  determine the fade type  
  Credits to: FrillyWumpus

**v2.00 (2018-02-26)**
* Initial build for v2.00
* Added: Support for Tiled v1.1.x
* Added: Custom collision handling
* Added: Opacity of layers
* Added: Images and parallax effects
* Added: Object tiles
* Added: Flipping and mirroring of object tiles
* Added: Basic support for event hooks
* Added: Support for infinite maps
* Added: Support for base64 encoded maps

**v1.10**
* Initial version