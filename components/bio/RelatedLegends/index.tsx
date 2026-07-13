import { LegendCard } from '@/components/cards/LegendCard';
import { CardGrid } from '@/components/cards/CardGrid';
import type { Legend } from '@/lib/content/seed-legends';
import type { Category } from '@/lib/content/seed-categories';

export interface RelatedLegendsProps {
  legends: Legend[];
  categories: Category[];
}

export function RelatedLegends({ legends, categories }: RelatedLegendsProps) {
  return (
    <CardGrid columns={4}>
      {legends.map((legend) => (
        <LegendCard
          key={legend.slug}
          legend={legend}
          categoryLabel={categories.find((c) => c.slug === legend.categorySlug)?.name ?? ''}
        />
      ))}
    </CardGrid>
  );
}

export default RelatedLegends;
