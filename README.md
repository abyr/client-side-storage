# Client Side storage adapter

## Adapter usage example

```js
 * import CacheableStorageAdapter from './cacheable-storage-adapter.js';
 *
 * class PreferrencesStoreAdapter extends CacheableStorageAdapter {
 *     constructor() {
 *         super();
 *
 *         this.name = 'preferrences';
 *     }
 * }
 *
 ```

## Type definition

```js
/**
 * @typedef {{
 *   name: string,
 *   fields: string[],
 * }} ClientSideStorageSchemaListItemIndex
 */

/**
 * @typedef {{
 *   name: string,
 *   keyPath: string,
 *   indexes: ClientSideStorageSchemaListItemIndex[]
 * }} ClientSideStorageSchemaListItem
 */

/**
 * @typedef {{
*   name: string,
*   version: number,
*   schema: ClientSideStorageSchemaListItem[]
* }} ClientSideStorageSchema
*/
```

## Schema object definition

```js
const schema = {
  name: 'WebApp',
  version: 1,
  schema: [{
        name: 'books',
        keyPath: 'id',
        indexes: [{
            name: 'bookId',
            fields: [ 'id' ]
       }]
    }, {
        name: 'preferrences',
        keyPath: 'id',
        indexes: [{
        name: 'preferrenceId',
            fields: [ 'id' ]
        }]
    }]
};
```
