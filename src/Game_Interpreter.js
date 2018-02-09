let _pluginCommmand = Game_Interpreter.prototype.pluginCommand
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    TiledManager.pluginCommand.call(this, command, args);
};
