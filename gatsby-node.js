const fetch = require('node-fetch')
const createNodeEntities = require('./createNodeEntities')
const normalizeKeys = require('./utils/normalizeKeys')
const flattenEntities = require('./utils/flattenEntities')
const getUrl = require('./utils/getUrl')
const buildNode = require('./utils/buildNode')

exports.sourceNodes = async (
  {
    actions, createNodeId, createContentDigest, store, cache
  },
  configOptions
) => {
  const { createNode, touchNode } = actions
  const {
    url,
    endPoint,
    rootKey = 'customAPI',
    schemas = {
      [rootKey]: 'users: [user]',
      user: 'id: Int',
      topic_list: 'topics: [topic]',
      topic: 'id: Int'
    }

  } = configOptions

  const URL = getUrl(process.env.NODE_ENV, `${url}/${endPoint}`)
  const data = await fetch(URL).then(res => res.json())

  // fetch "raw" data for each topic
  if (data.topic_list &&
    data.topic_list.topics &&
    data.topic_list.topics.length) {
    for (topic of data.topic_list.topics) {
      const URL = getUrl(process.env.NODE_ENV, `${url}/raw/${topic.id}.json`)
      topic.raw = await fetch(URL).then(res => res.text())
    }
  }

  // build entities and correct schemas, where necessary
  let entities = flattenEntities(createNodeEntities({
    name: rootKey,
    data,
    schemas,
    createNodeId
  }))

  // check for problematic keys
  entities = entities.map(entity => ({
    ...entity,
    data: normalizeKeys(entity.data)
  }))

  // build gatsby-node-object
  entities = entities.map(entity => buildNode({ entity, createContentDigest }))

  // render nodes
  entities.forEach((entity) => {
    createNode(entity)
  })
}
