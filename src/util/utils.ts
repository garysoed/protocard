export const IDS = {};

// TODO(gs): Split into different files.

export default {
  /**
   * Generates a key that is not a key in the given object.
   *
   * @param object Object containing keys that the newly generated key should not conflict with.
   * @param prefix Prefix of key to generate.
   * @return Key with the given prefix that does not conflict with the keys in the given
   *    object.
   */
  generateKey(object: any, prefix: string): string {
    let index = 0;
    let guess = prefix;

    while (object[guess] !== undefined) {
      guess = `${prefix}_${index}`;
      index++;
    }
    return guess;
  },

  /**
   * Generates an ID that has never been generated before.
   *
   * @param prefix Prefix of the ID to generate.
   * @return Newly generated unique ID.
   */
  getUniqueId(prefix: string): string {
    let newId = this.generateKey(IDS, prefix);
    IDS[newId] = newId;
    return newId;
  },

  /**
   * Maps the values in the given object.
   *
   * @param object Object to map the values in.
   * @param fn Function used to map the value. This function takes in one argument,
   *    which is the value to be mapped, and should return the mapped value.
   * @return Copy of the input object with the mapped values.
   */
  mapValue<V1, V2>(object: {[key: string]: V1}, fn: (arg: V1) => V2): {[key: string]: V2} {
    let out = <{[key: string]: V2}> {};
    for (let key in object) {
      out[key] = fn(object[key]);
    }
    return out;
  },
};
