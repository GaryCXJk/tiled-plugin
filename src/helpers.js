export const getProperty = (properties, propertyName) => {
    if (!properties) {
        return null
    }
    const property = Object.keys(properties).find((prop) => prop.name === propertyName);
    return property ? properties[property].value : null
}

export const getParam = (param, defaultValue = '') => {
    const pluginParams = PluginManager.parameters("YED_Tiled");
    if (Object.prototype.hasOwnProperty.call(pluginParams, param)) {
        return pluginParams[param];
    }
    return defaultValue;
}