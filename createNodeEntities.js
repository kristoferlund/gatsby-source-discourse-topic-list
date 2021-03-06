const { isObject, flattenArray, isArray } = require('./utils/helpers')
const uuid = require('uuid/v1')

function getEntityNodeLinks(entities, nodeData) {
  const links = {}
  entities.forEach((entity) => {
    const { name } = entity
    const linkName = name + '___NODE'
    if (links[linkName]) {
      links[linkName] = isArray(links[linkName])
        ? [...links[linkName], entity.id]
        : [links[linkName], entity.id]
      // check if node-content is an array.
      // if so, make the link also an array, to avoid conflicts,
      // when you have node-content-arrays with just one element
    } else if (isArray(nodeData[name])) {
      links[linkName] = [entity.id]
    } else {
      links[linkName] = entity.id
    }
  })
  return links
}

function getChildNodeKeys(data, schemas) {
  if (!data) return []
  return Object.keys(data).filter((key) => {
    if (isObject(data[key])) return true
    if (isArray(data[key]) && schemas[key]) {
      return true
    }
    return false
  })
}

function getDataWithoutChildEntities(data, childNodeKeys) {
  const newData = { ...data }
  childNodeKeys.forEach((key) => {
    delete newData[key]
  })
  return newData
}

function buildEntity({
  name, data, schemas, createNodeId
}) {
  const childNodeKeys = getChildNodeKeys(data, schemas)
  const childEntities = flattenArray(
    childNodeKeys.map(key => (
      createNodeEntities({
        name: key,
        data: data[key],
        schemas,
        createNodeId
      })
    ))
  )
  const dataWithoutChildEntities = getDataWithoutChildEntities(data, childNodeKeys)
  const entityNodeLinks = getEntityNodeLinks(childEntities, data)
  return [{
    id: createNodeId(name + uuid()),
    name,
    data: dataWithoutChildEntities,
    links: entityNodeLinks,
    childEntities
  }]
}

function createNodeEntities({
  name, data, createNodeId, schemas
}) {
  if (isArray(data)) {
    const entitiesArray = data.map(d => buildEntity({
      name,
      data: d,
      schemas,
      createNodeId
    }))
    return flattenArray(entitiesArray)
  }
  if (isObject(data)) {
    return buildEntity({
      name,
      data: data,
      schemas,
      createNodeId
    })
  }
  return []
}

module.exports = createNodeEntities
