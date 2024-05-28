/**
 * CacheableStorageAdapter
 *
 *
 * Usage example:
 *
 * ```js
 * import CacheableStorageAdapter from './cacheable-storage-adapter.js';
 *
 * class PreferrencesStoreAdapter extends CacheableStorageAdapter {
 *     constructor() {
 *         super();
 *
 *         this.name = 'preferrences';
 *     }
 * }
 * ```
 */

import IndexedDBApi from '../api/indexed-db-api.js';

class CacheableStorageAdapter {
    constructor() {

        /**
         * @protected
         */
         this.name = undefined;

        /**
         * @protected
         */
        this._cache = null;
    }

    async connect(dbSchema) {
        const idba = this._getDBApi(dbSchema);

        await idba.connect();

        this.idba = idba;
    }

    _getDBApi() {
        return new IndexedDBApi(dbSchema);
    }

    /**
     * @param {Number} key
     * @param {Mixed} value
     * @returns {Promise}
     */
    put(key, value) {
        return new Promise((resolve, reject) => {
            this.invalidateCache();

            this.idba.putRecord(this.name, {
                id: key,
                value
            }).then(res => {
                resolve(res);

            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }

    /**
     * @param {String} key
     * @returns {Promise}
     */
    get(key) {
        return new Promise((resolve, reject) => {
            const cachedRes = this._getCached(key);

            if (cachedRes) {
                resolve(cachedRes);
                return;
            }

            this.idba.getRecord(this.name, key).then(res => {
                if (!this._cache) {
                    this._cache = {};
                }
                this._putCache(key, res);
                resolve(res);

            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }

    /**
     * @returns {Promise}
     */
     getAll() {
        return new Promise((resolve, reject) => {
            this.idba.getAllRecords(this.name).then(res => {
                this._cache = res.reduce((map, x) => {
                    map[x.id] = x;

                    return map;
                }, {});
                resolve(res);

            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }

    /**
     * @returns {Promise}
     */
    getAllMap() {
        return new Promise((resolve, reject) => {
            this.idba.getAllRecords(this.name).then(res => {
                this._cache = res.reduce((map, x) => {
                    map[x.id] = x;

                    return map;
                }, {});
                resolve(this._cache);

            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }

    /**
     * @protected
     * @param {String} key
     * @returns {Object|undefined}
     */
    _getCached(key) {
        return this._cache && this._cache[key];
    }

    /**
     * @protected
     * @param {String} key
     * @param {Mixed} value
     */
    _putCache(key, value) {
        if (!this._cache) {
            this._cache = {};
        }

        this._cache[key] = value;
    }

    clear() {
        this.invalidateCache();
        return this.idba.clear(this.name);
    }

    invalidateCache() {
        this._cache = null;
    }
}

export default CacheableStorageAdapter;