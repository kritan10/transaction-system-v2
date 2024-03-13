/**
 * Simple promisify method for sqlite callbacks.
 * @param {any} db The SQLite db object to promisify.
 * @returns The promisified db object.
 */
export function promisify(db) {
  return {
    get(sql, params) {
      return new Promise((resolve, reject) => {
        db.get(sql, params, (err, res) => {
          if (err) return reject(err);
          return resolve(res);
        });
      });
    },

    run(sql, params) {
      return new Promise((resolve, reject) => {
        db.run(sql, params, (err, res) => {
          if (err) return reject(err);
          return resolve(res);
        });
      });
    },
  };
}
