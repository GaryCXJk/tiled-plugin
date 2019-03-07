export const getProperty = (properties, propertyName) => {
    if (!properties) {
        return null
    }
    const property = Object.keys(properties).find((prop) => prop.name === propertyName);
    return property ? properties[property].value : null
}