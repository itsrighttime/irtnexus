import { BADGE_CATEGORIES, BADGE_DEFINITIONS } from "./badgeDefinitions.js";

export function validateBadges(badges) {
  const categories = {};

  for (const badge of badges) {
    const def = BADGE_DEFINITIONS[badge.id];
    if (!def) continue;

    const cat = def.category;
    if (!categories[cat]) categories[cat] = [];

    categories[cat].push(def);
  }

  // validation rules
  const errors = [];

  for (const [cat, items] of Object.entries(categories)) {
    if (
      cat === BADGE_CATEGORIES.verification ||
      cat === BADGE_CATEGORIES.trust ||
      cat === BADGE_CATEGORIES.proof
    ) {
      if (items.length > 1) {
        errors.push(
          `Only ONE badge is allowed for category: ${cat}. Found: ${items
            .map((i) => i.label)
            .join(", ")}`,
        );
      }
    }
  }

  return errors;
}
