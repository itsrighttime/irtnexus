import { logger } from "#utils";
import { TRAVERSAL_PROFILES } from "../config/traversalProfiles.js";

/**
 * Checks if the given edgeType is allowed for the specified traversal profile.
 *
 * @param {string} profileKey - The key of the traversal profile (e.g., "AUTH_CONTEXT")
 * @param {string} edgeType - The edge type to check
 * @returns {boolean} true if allowed, false otherwise
 */
export function isEdgeAllowed(profileKey, edgeType) {
  const profile = TRAVERSAL_PROFILES[profileKey];

  console.log("DDDD : ", profileKey, edgeType, profile);

  if (!profile) {
    logger.warn(`Traversal profile "${profileKey}" does not exist.`);
    return false;
  }

  return profile.allowedEdgeTypes.includes(edgeType);
}
