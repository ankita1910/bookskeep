import { DB, OBJECTSTORE, USERSTORE, READONLY, READWRITE } from '../constants/indexeddb'
let idb = null
let dbInstance = null

const initialize = (callback) => {
    idb = window.indexedDB
    let request = idb.open(DB, 1)

    request.onsuccess = (event) => {
        dbInstance = event.target.result
        callback()
    }

    request.onerror = (event) => {
        console.log('Error in creating BooksKeep database', request.error)
    }

    request.onupgradeneeded = (event) => {
        if (!dbInstance) {
            dbInstance = event.target.result
        }

        dbInstance.createObjectStore(OBJECTSTORE, { keyPath: 'id' })
        dbInstance.createObjectStore(USERSTORE, { keyPath: 'id' })
    }
}

const getStore = (type, mode) => {
    let transaction = dbInstance.transaction(type, mode)
    return transaction.objectStore(type)
}

const update = (type, data, callback) => {
    let store = getStore(type, READWRITE)
    if (!data.id) {
        data.id = new Date().getTime()
    }
    let updateRequest = store.put(data)
    updateRequest.onsuccess = (event) => {
        typeof callback === 'function' && callback(data)
    }
}

const getAll = (type, callback) => {
    let store = getStore(type, READONLY)
    let getAllRequest = store.getAll()
    getAllRequest.onsuccess = (event) => {
        callback(event.target.result)
    }
}

const getItem = (type, id, callback) => {
    let store = getStore(type, READONLY)
    let getItemRequest = store.get(id)
    getItemRequest.onsuccess = (event) => {
        callback(event.target.result)
    }
}

const deleteItem = (type, id, callback) => {
    let store = getStore(type, READWRITE)
    let deleteItemRequest = store.delete(id)
    deleteItemRequest.onsuccess = (event) => {
        callback()
    }
}

export const IndexedDbWrapper = {
    initialize,
    update,
    getAll,
    getItem,
    deleteItem
}
