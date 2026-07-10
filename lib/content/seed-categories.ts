import type { Category } from '@/lib/types/domain';

/** Re-exported for backward compatibility — canonical type lives in lib/types/domain.ts. */
export type { Category };

/**
 * Seed categories. `hasContent` reflects the honest Polish Sprint fix:
 * categories without real biographies show a "Coming Soon" state instead
 * of a dead-end click. With the Phase 2 roster expansion (10 legends),
 * Scientists, Inventors, Freedom Fighters, Artists, and Politicians are
 * now genuinely populated.
 */
export const seedCategories: Category[] = [
  { slug: 'scientists', name: 'Scientists', description: "The researchers and thinkers who expanded humanity's understanding of the universe.", hasContent: true },
  { slug: 'entrepreneurs', name: 'Entrepreneurs', description: 'The builders who turned bold ideas into enduring institutions.', hasContent: false },
  { slug: 'freedom-fighters', name: 'Freedom Fighters', description: 'The leaders who risked everything in the pursuit of justice and liberty.', hasContent: true },
  { slug: 'inventors', name: 'Inventors', description: 'The engineers and builders whose ideas redefined what was possible.', hasContent: true },
  { slug: 'politicians', name: 'Politicians', description: 'The statesmen and stateswomen who shaped nations.', hasContent: true },
  { slug: 'artists', name: 'Artists', description: 'The painters, sculptors, and creators whose work outlived them.', hasContent: true },
  { slug: 'writers', name: 'Writers', description: 'The authors and poets whose words shaped culture.', hasContent: false },
  { slug: 'athletes', name: 'Athletes', description: "History's most extraordinary competitors.", hasContent: false },
  { slug: 'philosophers', name: 'Philosophers', description: 'The thinkers who questioned everything.', hasContent: false },
  { slug: 'explorers', name: 'Explorers', description: 'Those who charted the unknown.', hasContent: false },
];
