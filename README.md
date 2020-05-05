![Logo of gatsby-source-discourse-topic-list-logo](https://github.com/kristoferlund/gatsby-source-discourse-topic-list/raw/master/gatsby-source-discourse-topic-list-logo.png)

[![npm version](https://img.shields.io/npm/v/gatsby-source-discourse-topic-list.svg?style=flat-square)](https://www.npmjs.com/package/gatsby-source-discourse-topic-list) [![npm downloads](https://img.shields.io/npm/dm/gatsby-source-discourse-topic-list.svg?style=flat-square)](https://www.npmjs.com/package/gatsby-source-discourse-topic-list) 

**gatsby-source-discourse-topic-list** helps you source topic lists from the [Discourse](https://www.discourse.org/) discussion forum platform and transform it into Gatsby nodes.

In addition to the topic list provided by the Discourse api, the plugin also fetches the raw text for each topic. 

## Getting Started

1. Install the package with **yarn** or **npm**

`yarn add gatsby-source-discourse-topic-list`

2. Add to plugins in your gatsby-config.js

```javascript
module.exports = {
    plugins: [
        {
            resolve: "gatsby-source-discourse-topic-list",
            options: {
                url: "https://my-discourse-server.com"
                endPoint: 'top.json',
            }
        }
    ]
};
```

## Options

| **Name**  | **Type**         | **Description**                                                                                                                                                                                         |
| :-------- | :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| url       | object or string | `Required.` Url of your Discourse installation as a string. If you have two different APIs for development and production, define an object with the keys `production` and `development`.                                  |
| endPoint   | string           | `Required.` Any Discourse API endpoint returning a `topic_list`.|
| rootKey   | string           | `Optional.` Name your API.|


### Example Discourse API endpoints

Latest topics in a category:
```
options: {
    url: "https://meta.discourse.org"
    endPoint: 'c/1.json',
}
```

Latest topics in a category, filtered by tag:

```
options: {
    url: "https://meta.discourse.org"
    endPoint: 'tags/c/bug/1/pr-welcome.json',
}
```
Top topics in a category:

```
options: {
    url: "https://meta.discourse.org"
    endPoint: 'c/support/6/l/top.json',
}
```

See the [Discourse API documentation] for a full list of enpoints.

## Multiple Sources? Multiple Instances!

If you would like to fetch multiple endpoints in your project, just instantiate the plugin multiple times. Just be sure to set a different `rootKey` for every instance. 


## Credits

This plugin builds on the excellent [gatsby-source-custom-api](https://github.com/AndreasFaust/gatsby-source-custom-api) by [Andreas Faust](https://github.com/AndreasFaust). 🙏

## Contributing

Every contribution is very much appreciated.
Feel free to file bugs, feature- and pull-requests.

❤️ If this plugin is helpful for you, star it on [GitHub](https://github.com/kristoferlund/gatsby-source-discourse-topic-list).