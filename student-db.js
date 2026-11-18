
/* ==========================================
   ATLAS MÉDICAL
   BASE DE DONNÉES LOCALE ÉTUDIANTE
   IndexedDB — Version 1
========================================== */

(function () {
  "use strict";

  const DB_NAME = "atlas-student-space";
  const DB_VERSION = 1;

  let databasePromise = null;

  const STORES = {
    documents: {
      indexes: ["createdAt", "type"]
    },
    notes: {
      indexes: ["documentId", "updatedAt"]
    },
    recordings: {
      indexes: ["createdAt"]
    },
    settings: {
      indexes: []
    }
  };

  function createId() {
    if (
      window.crypto &&
      typeof window.crypto.randomUUID === "function"
    ) {
      return window.crypto.randomUUID();
    }

    return (
      Date.now().toString(36) +
      Math.random().toString(36).slice(2)
    );
  }

  function openDatabase() {
    if (!("indexedDB" in window)) {
      return Promise.reject(
        new Error("IndexedDB n'est pas disponible.")
      );
    }

    if (databasePromise) {
      return databasePromise;
    }

    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(
        DB_NAME,
        DB_VERSION
      );

      request.onupgradeneeded = event => {
        const db = event.target.result;

        Object.entries(STORES).forEach(([name, config]) => {
          let store;

          if (!db.objectStoreNames.contains(name)) {
            store = db.createObjectStore(name, {
              keyPath: "id"
            });
          } else {
            store = event.target.transaction
              .objectStore(name);
          }

          config.indexes.forEach(index => {
            if (!store.indexNames.contains(index)) {
              store.createIndex(
                index,
                index,
                { unique: false }
              );
            }
          });
        });
      };

      request.onsuccess = () => {
        const db = request.result;

        db.onversionchange = () => {
          db.close();
          databasePromise = null;
        };

        resolve(db);
      };

      request.onerror = () => {
        databasePromise = null;
        reject(request.error);
      };

      request.onblocked = () => {
        console.warn(
          "La mise à jour de la base Atlas est bloquée."
        );
      };
    });

    return databasePromise;
  }

  function execute(storeName, mode, operation) {
    return openDatabase().then(db => {
      return new Promise((resolve, reject) => {
        let transaction;
        let result;

        try {
          transaction = db.transaction(
            storeName,
            mode
          );

          const store = transaction.objectStore(storeName);

          const request = operation(store);

          if (request) {
            request.onsuccess = () => {
              result = request.result;
            };

            request.onerror = () => {
              reject(request.error);
            };
          }

          transaction.oncomplete = () => {
            resolve(result);
          };

          transaction.onerror = () => {
            reject(
              transaction.error ||
              new Error("Erreur de stockage.")
            );
          };

          transaction.onabort = () => {
            reject(
              transaction.error ||
              new Error("Opération annulée.")
            );
          };
        } catch (error) {
          if (transaction) {
            try {
              transaction.abort();
            } catch (_) {}
          }

          reject(error);
        }
      });
    });
  }

  function add(store, data) {
    const record = {
      ...data,
      id: data.id || createId()
    };

    return execute(store, "readwrite", objectStore =>
      objectStore.add(record)
    ).then(() => record.id);
  }

  function get(store, id) {
    return execute(store, "readonly", objectStore =>
      objectStore.get(id)
    );
  }

  function getAll(store) {
    return execute(store, "readonly", objectStore =>
      objectStore.getAll()
    );
  }

  function update(store, data) {
    if (!data || !data.id) {
      return Promise.reject(
        new Error("Identifiant manquant.")
      );
    }

    return execute(store, "readwrite", objectStore =>
      objectStore.put(data)
    );
  }

  function remove(store, id) {
    return execute(store, "readwrite", objectStore =>
      objectStore.delete(id)
    );
  }

  function createCollection(storeName) {
    return {
      add: data => add(storeName, data),
      get: id => get(storeName, id),
      getAll: () => getAll(storeName),
      update: data => update(storeName, data),
      delete: id => remove(storeName, id)
    };
  }

  const AtlasStudentDB = {
    open: openDatabase,

    documents: createCollection("documents"),

    notes: createCollection("notes"),

    recordings: createCollection("recordings"),

    settings: {
      get: key => get("settings", key),

      getAll: () => getAll("settings"),

      save: (key, value) => {
        return execute(
          "settings",
          "readwrite",
          store => store.put({
            id: key,
            value: value
          })
        );
      },

      delete: key => remove("settings", key)
    }
  };

  window.AtlasStudentDB = AtlasStudentDB;

})();

