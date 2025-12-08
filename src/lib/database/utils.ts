/**
 * Shared utility functions for database serialization/deserialization
 */

/**
 * Serialize a required array to JSON string
 */
export function serializeArray(arr: string[]): string {
  return JSON.stringify(arr);
}

/**
 * Serialize an optional array to JSON string
 */
export function serializeOptionalArray(arr?: string[]): string {
  return arr ? JSON.stringify(arr) : '[]';
}

/**
 * Deserialize a JSON string to a required array
 * Returns empty array if parsing fails
 */
export function deserializeArray(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Deserialize a JSON string to an optional array
 * Returns undefined if array is empty or parsing fails
 * Note: Empty arrays are intentionally treated as undefined to distinguish
 * between "no data" and "has data". This means empty arrays do not survive
 * round-trip serialization, which is the intended behavior for optional relationships.
 */
export function deserializeOptionalArray(json: string): string[] | undefined {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
  } catch {
    return undefined;
  }
}
