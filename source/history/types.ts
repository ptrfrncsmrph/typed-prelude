/**
 * A type-alias to represent strings that are HREFs.
 * @name Href
 * @type
 */
export type Href = string

/**
 * Implementations of `Location` and `History`.
 * @name Env
 * @type
 */
export type HistoryResources = Readonly<{ location: Location; history: History }>
