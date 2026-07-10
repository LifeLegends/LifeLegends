-- ============================================================================
-- LifeLegends — Seed Data (all 10 launch legends)
-- Run AFTER 0001_init.sql. Safe to re-run only against an empty database.
-- ============================================================================

-- Categories (idempotent — safe to re-run)
insert into categories (slug, name, description, sort_order) values ('scientists', 'Scientists', 'The researchers and thinkers who expanded humanity''s understanding of the universe.', 1) on conflict (slug) do nothing;
insert into categories (slug, name, description, sort_order) values ('entrepreneurs', 'Entrepreneurs', 'The builders who turned bold ideas into enduring institutions.', 2) on conflict (slug) do nothing;
insert into categories (slug, name, description, sort_order) values ('freedom-fighters', 'Freedom Fighters', 'The leaders who risked everything in the pursuit of justice and liberty.', 3) on conflict (slug) do nothing;
insert into categories (slug, name, description, sort_order) values ('inventors', 'Inventors', 'The engineers and builders whose ideas redefined what was possible.', 4) on conflict (slug) do nothing;
insert into categories (slug, name, description, sort_order) values ('politicians', 'Politicians', 'The statesmen and stateswomen who shaped nations.', 5) on conflict (slug) do nothing;
insert into categories (slug, name, description, sort_order) values ('artists', 'Artists', 'The painters, sculptors, and creators whose work outlived them.', 6) on conflict (slug) do nothing;
insert into categories (slug, name, description, sort_order) values ('writers', 'Writers', 'The authors and poets whose words shaped culture.', 7) on conflict (slug) do nothing;
insert into categories (slug, name, description, sort_order) values ('athletes', 'Athletes', 'History''s most extraordinary competitors.', 8) on conflict (slug) do nothing;
insert into categories (slug, name, description, sort_order) values ('philosophers', 'Philosophers', 'The thinkers who questioned everything.', 9) on conflict (slug) do nothing;
insert into categories (slug, name, description, sort_order) values ('explorers', 'Explorers', 'Those who charted the unknown.', 10) on conflict (slug) do nothing;

-- ============ Nikola Tesla ============
-- Idempotent: skip entirely if this legend was already seeded.
insert into biographies (slug, name, roles, birth_year, death_year, nationality, profession, tagline, intro, overview_title, overview, stats, featured, view_count, status)
select 'tesla', 'Nikola Tesla', ARRAY['Inventor','Engineer','Futurist']::text[], 1856, 1943,
    'Serbian-American', 'Electrical Engineer', '"The Man Who Lit Up the World."', 'A visionary inventor and electrical engineer who revolutionized the modern world with alternating current, wireless energy, and futuristic ideas decades ahead of his time.',
    'A Mind Ahead of Its Century', ARRAY['Born in 1856 in Smiljan, in the Austrian Empire, Nikola Tesla would go on to hold hundreds of patents across a dozen countries.','After studying engineering in Graz and Prague, Tesla emigrated to the United States in 1884.','His rivalry with Thomas Edison and his wireless-energy experiments at Wardenclyffe made him an enduring symbol of visionary genius.']::text[], '[{"value": 700, "label": "Patents"}, {"value": 300, "label": "Inventions"}, {"value": 26, "label": "Countries"}, {"value": "\u221e", "label": "Impact"}]'::jsonb,
    true, 25600, 'published'
where not exists (select 1 from biographies where slug = 'tesla');

insert into biography_categories (biography_id, category_id, is_primary)
select b.id, c.id, true
from biographies b, categories c
where b.slug = 'tesla' and c.slug = 'inventors'
and not exists (
  select 1 from biography_categories bc where bc.biography_id = b.id and bc.category_id = c.id
);

-- Child rows only inserted if this biography has none yet (idempotent re-run safety).
do $$
declare bio_id uuid;
begin
  select id into bio_id from biographies where slug = 'tesla';
  if bio_id is null then
    return;
  end if;

  if not exists (select 1 from timeline_events where biography_id = bio_id) then
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1856, 'Born in Smiljan', 'Nikola Tesla is born in the Austrian Empire.', 0);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1875, 'Studies at Graz University', 'Enrolls to study electrical engineering.', 1);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1884, 'Moves to the United States', 'Arrives in New York with a letter to Edison.', 2);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1891, 'Patents the AC Induction Motor', 'His polyphase AC system becomes foundational.', 3);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1893, 'Chicago World''s Fair', 'Demonstrates AC power publicly.', 4);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1943, 'Passes Away in New York', 'Dies in a New York hotel room.', 5);
  end if;

  if not exists (select 1 from achievements where biography_id = bio_id) then
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '700', 'Patents Filed', 'Across the US, Europe, and beyond.', 0);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, 'AC', 'Polyphase System', 'Backbone of modern power distribution.', 1);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '1943', 'Enduring Legacy', 'Honored with the SI unit tesla (T).', 2);
  end if;

  if not exists (select 1 from quotes where biography_id = bio_id) then
    insert into quotes (biography_id, text, attribution, featured, sort_order) values (bio_id, '"The present is theirs; the future, for which I really worked, is mine."', 'Nikola Tesla', true, 0);
  end if;

  if not exists (select 1 from facts where biography_id = bio_id) then
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'Tesla could allegedly speak eight languages fluently.', 'He was fluent in Serbian, English, Czech, German, French, Hungarian, Italian, and Latin.', 0);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'He envisioned global wireless communication decades early.', 'His Wardenclyffe project aimed to transmit power wirelessly.', 1);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'Tesla never married.', 'He said celibacy helped him focus on his inventions.', 2);
  end if;

  if not exists (select 1 from sources where biography_id = bio_id) then
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Smithsonian Institution', 'Archival biography', 0);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'IEEE History Center', 'Engineering legacy review', 1);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Tesla Science Center at Wardenclyffe', 'Primary source materials', 2);
  end if;

  insert into seo_metadata (biography_id, meta_title, meta_description, canonical_path)
  values (bio_id, 'Nikola Tesla | LifeLegends', 'A visionary inventor and electrical engineer who revolutionized the modern world with alternating current, wireless energy, and futuristic ideas decades ahead of his time.', '/legends/tesla')
  on conflict (biography_id) do nothing;
end $$;



-- ============ Albert Einstein ============
-- Idempotent: skip entirely if this legend was already seeded.
insert into biographies (slug, name, roles, birth_year, death_year, nationality, profession, tagline, intro, overview_title, overview, stats, featured, view_count, status)
select 'einstein', 'Albert Einstein', ARRAY['Physicist','Theorist','Nobel Laureate']::text[], 1879, 1955,
    'German-American', 'Theoretical Physicist', '"Imagination is more important than knowledge."', 'A theoretical physicist whose theory of relativity reshaped humanity''s understanding of space, time, and gravity.',
    'The Architect of Relativity', ARRAY['Born in Ulm, Germany in 1879, Einstein showed early fascination with mathematics and physics.','While working as a patent clerk, Einstein published four papers in 1905, his ''miracle year.''','His 1915 general theory of relativity redefined gravity itself.']::text[], '[{"value": 300, "label": "Papers Published"}, {"value": 1921, "label": "Nobel Prize"}, {"value": 4, "label": "Fields Advanced"}, {"value": "\u221e", "label": "Impact"}]'::jsonb,
    true, 17800, 'published'
where not exists (select 1 from biographies where slug = 'einstein');

insert into biography_categories (biography_id, category_id, is_primary)
select b.id, c.id, true
from biographies b, categories c
where b.slug = 'einstein' and c.slug = 'scientists'
and not exists (
  select 1 from biography_categories bc where bc.biography_id = b.id and bc.category_id = c.id
);

-- Child rows only inserted if this biography has none yet (idempotent re-run safety).
do $$
declare bio_id uuid;
begin
  select id into bio_id from biographies where slug = 'einstein';
  if bio_id is null then
    return;
  end if;

  if not exists (select 1 from timeline_events where biography_id = bio_id) then
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1879, 'Born in Ulm, Germany', 'Born into a middle-class Jewish family.', 0);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1900, 'Graduates ETH Zurich', 'Completes his teaching diploma.', 1);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1905, 'The Miracle Year', 'Publishes four groundbreaking papers.', 2);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1915, 'General Theory of Relativity', 'Presents gravity as spacetime curvature.', 3);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1921, 'Wins the Nobel Prize', 'Awarded for the photoelectric effect.', 4);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1955, 'Passes Away in Princeton', 'Dies as the most recognized scientist of his century.', 5);
  end if;

  if not exists (select 1 from achievements where biography_id = bio_id) then
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '1921', 'Nobel Prize in Physics', 'For the photoelectric effect.', 0);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, 'E=mc²', 'Mass-Energy Equivalence', 'Linking mass and energy.', 1);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '1915', 'General Relativity', 'Confirmed observationally in 1919.', 2);
  end if;

  if not exists (select 1 from quotes where biography_id = bio_id) then
    insert into quotes (biography_id, text, attribution, featured, sort_order) values (bio_id, '"Imagination is more important than knowledge."', 'Albert Einstein', true, 0);
  end if;

  if not exists (select 1 from facts where biography_id = bio_id) then
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'Einstein was offered the presidency of Israel in 1952.', 'He respectfully declined.', 0);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'He did not fail math as a student.', 'That popular story is a myth.', 1);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'His brain was preserved for scientific study.', 'Without his family''s initial permission.', 2);
  end if;

  if not exists (select 1 from sources where biography_id = bio_id) then
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Nobel Prize Organization', 'Official biography', 0);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Princeton University Archives', 'Personal papers', 1);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'American Institute of Physics', 'Historical record', 2);
  end if;

  insert into seo_metadata (biography_id, meta_title, meta_description, canonical_path)
  values (bio_id, 'Albert Einstein | LifeLegends', 'A theoretical physicist whose theory of relativity reshaped humanity''s understanding of space, time, and gravity.', '/legends/einstein')
  on conflict (biography_id) do nothing;
end $$;



-- ============ Marie Curie ============
-- Idempotent: skip entirely if this legend was already seeded.
insert into biographies (slug, name, roles, birth_year, death_year, nationality, profession, tagline, intro, overview_title, overview, stats, featured, view_count, status)
select 'curie', 'Marie Curie', ARRAY['Physicist','Chemist','Nobel Laureate']::text[], 1867, 1934,
    'Polish-French', 'Physicist & Chemist', '"Nothing in life is to be feared, it is only to be understood."', 'A pioneering physicist and chemist whose research on radioactivity made her the first person to win Nobel Prizes in two sciences.',
    'Illuminating the Invisible', ARRAY['Born Maria Skłodowska in Warsaw in 1867, Curie moved to Paris to study at the Sorbonne.','With husband Pierre, she discovered polonium and radium, coining the term ''radioactivity.''','Her work came at great personal cost but revolutionized physics and medicine.']::text[], '[{"value": 2, "label": "Nobel Prizes"}, {"value": 2, "label": "Elements Discovered"}, {"value": 1, "label": "First Woman Professor"}, {"value": "\u221e", "label": "Impact"}]'::jsonb,
    true, 19200, 'published'
where not exists (select 1 from biographies where slug = 'curie');

insert into biography_categories (biography_id, category_id, is_primary)
select b.id, c.id, true
from biographies b, categories c
where b.slug = 'curie' and c.slug = 'scientists'
and not exists (
  select 1 from biography_categories bc where bc.biography_id = b.id and bc.category_id = c.id
);

-- Child rows only inserted if this biography has none yet (idempotent re-run safety).
do $$
declare bio_id uuid;
begin
  select id into bio_id from biographies where slug = 'curie';
  if bio_id is null then
    return;
  end if;

  if not exists (select 1 from timeline_events where biography_id = bio_id) then
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1867, 'Born in Warsaw, Poland', 'Born under Russian occupation.', 0);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1891, 'Moves to Paris', 'Enrolls at the Sorbonne.', 1);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1898, 'Discovers Polonium and Radium', 'With husband Pierre Curie.', 2);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1903, 'First Nobel Prize', 'Shares the Physics prize.', 3);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1911, 'Second Nobel Prize', 'Wins Chemistry, first in two sciences.', 4);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1934, 'Passes Away', 'Dies from aplastic anemia.', 5);
  end if;

  if not exists (select 1 from achievements where biography_id = bio_id) then
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '2', 'Nobel Prizes', 'In two different scientific fields.', 0);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, 'Ra & Po', 'Elements Discovered', 'Founding the study of radioactivity.', 1);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '1', 'First Woman Professor', 'At the University of Paris.', 2);
  end if;

  if not exists (select 1 from quotes where biography_id = bio_id) then
    insert into quotes (biography_id, text, attribution, featured, sort_order) values (bio_id, '"Nothing in life is to be feared, it is only to be understood."', 'Marie Curie', true, 0);
  end if;

  if not exists (select 1 from facts where biography_id = bio_id) then
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'Her research notebooks are still radioactive today.', 'Kept in lead-lined boxes.', 0);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'She created mobile X-ray units during WWI.', 'Known as ''petites Curies.''', 1);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'She remains the only person with Nobels in two sciences.', 'Physics and chemistry.', 2);
  end if;

  if not exists (select 1 from sources where biography_id = bio_id) then
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Nobel Prize Organization', 'Official biography', 0);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Curie Museum, Paris', 'Institut Curie archive', 1);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'French National Library', 'Personal papers', 2);
  end if;

  insert into seo_metadata (biography_id, meta_title, meta_description, canonical_path)
  values (bio_id, 'Marie Curie | LifeLegends', 'A pioneering physicist and chemist whose research on radioactivity made her the first person to win Nobel Prizes in two sciences.', '/legends/curie')
  on conflict (biography_id) do nothing;
end $$;



-- ============ Leonardo da Vinci ============
-- Idempotent: skip entirely if this legend was already seeded.
insert into biographies (slug, name, roles, birth_year, death_year, nationality, profession, tagline, intro, overview_title, overview, stats, featured, view_count, status)
select 'davinci', 'Leonardo da Vinci', ARRAY['Artist','Inventor','Polymath']::text[], 1452, 1519,
    'Italian', 'Artist & Inventor', '"Simplicity is the ultimate sophistication."', 'A Renaissance polymath whose paintings, anatomical studies, and engineering sketches made him one of history''s most diversely talented individuals.',
    'The Original Renaissance Mind', ARRAY['Born in 1452 in Vinci, Leonardo apprenticed under Verrocchio in Florence.','Beyond the Mona Lisa and The Last Supper, he filled notebooks with visionary studies.','He worked across Florence, Milan, and Rome, dying in France under royal patronage.']::text[], '[{"value": 20, "label": "Surviving Paintings"}, {"value": 7000, "label": "Notebook Pages"}, {"value": 3, "label": "Italian City-States"}, {"value": "\u221e", "label": "Impact"}]'::jsonb,
    false, 14400, 'published'
where not exists (select 1 from biographies where slug = 'davinci');

insert into biography_categories (biography_id, category_id, is_primary)
select b.id, c.id, true
from biographies b, categories c
where b.slug = 'davinci' and c.slug = 'artists'
and not exists (
  select 1 from biography_categories bc where bc.biography_id = b.id and bc.category_id = c.id
);

-- Child rows only inserted if this biography has none yet (idempotent re-run safety).
do $$
declare bio_id uuid;
begin
  select id into bio_id from biographies where slug = 'davinci';
  if bio_id is null then
    return;
  end if;

  if not exists (select 1 from timeline_events where biography_id = bio_id) then
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1452, 'Born in Vinci, Tuscany', 'Born to a notary and a peasant woman.', 0);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1466, 'Apprentices under Verrocchio', 'Joins the Florence workshop.', 1);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1482, 'Moves to Milan', 'Serves Ludovico Sforza.', 2);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1495, 'Paints The Last Supper', 'One of the most reproduced paintings.', 3);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1503, 'Begins the Mona Lisa', 'The world''s most famous portrait.', 4);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1519, 'Passes Away in France', 'Dies under Francis I''s patronage.', 5);
  end if;

  if not exists (select 1 from achievements where biography_id = bio_id) then
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, 'Mona Lisa', 'Most Famous Portrait', 'Housed at the Louvre.', 0);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '7000', 'Notebook Pages', 'Anatomical and engineering studies.', 1);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, 'Polymath', 'Renaissance Ideal', 'Painting to architecture.', 2);
  end if;

  if not exists (select 1 from quotes where biography_id = bio_id) then
    insert into quotes (biography_id, text, attribution, featured, sort_order) values (bio_id, '"Simplicity is the ultimate sophistication."', 'Leonardo da Vinci', true, 0);
  end if;

  if not exists (select 1 from facts where biography_id = bio_id) then
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'He wrote in mirror-image handwriting.', 'Right-to-left reverse script.', 0);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'He designed flying machines centuries early.', 'Ornithopters and parachutes.', 1);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'The Mona Lisa may never have been finished.', 'He kept it for years.', 2);
  end if;

  if not exists (select 1 from sources where biography_id = bio_id) then
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Musée du Louvre', 'Painting conservation records', 0);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Biblioteca Reale di Torino', 'Self-portrait provenance', 1);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Royal Collection Trust', 'Manuscript archive', 2);
  end if;

  insert into seo_metadata (biography_id, meta_title, meta_description, canonical_path)
  values (bio_id, 'Leonardo da Vinci | LifeLegends', 'A Renaissance polymath whose paintings, anatomical studies, and engineering sketches made him one of history''s most diversely talented individuals.', '/legends/davinci')
  on conflict (biography_id) do nothing;
end $$;



-- ============ Nelson Mandela ============
-- Idempotent: skip entirely if this legend was already seeded.
insert into biographies (slug, name, roles, birth_year, death_year, nationality, profession, tagline, intro, overview_title, overview, stats, featured, view_count, status)
select 'mandela', 'Nelson Mandela', ARRAY['Leader','Activist','President']::text[], 1918, 2013,
    'South African', 'Anti-Apartheid Leader & President', '"It always seems impossible until it''s done."', 'A revolutionary leader and South Africa''s first Black president, whose 27 years of imprisonment made him a global symbol of resilience.',
    'From Prisoner to President', ARRAY['Born in 1918 in Mvezo, Mandela trained as a lawyer and led ANC resistance to apartheid.','Arrested in 1962, he spent 27 years imprisoned, mostly on Robben Island.','Released in 1990, he became South Africa''s first democratically elected president in 1994.']::text[], '[{"value": 27, "label": "Years Imprisoned"}, {"value": 1994, "label": "Elected President"}, {"value": 1993, "label": "Nobel Peace Prize"}, {"value": "\u221e", "label": "Impact"}]'::jsonb,
    true, 12100, 'published'
where not exists (select 1 from biographies where slug = 'mandela');

insert into biography_categories (biography_id, category_id, is_primary)
select b.id, c.id, true
from biographies b, categories c
where b.slug = 'mandela' and c.slug = 'freedom-fighters'
and not exists (
  select 1 from biography_categories bc where bc.biography_id = b.id and bc.category_id = c.id
);

-- Child rows only inserted if this biography has none yet (idempotent re-run safety).
do $$
declare bio_id uuid;
begin
  select id into bio_id from biographies where slug = 'mandela';
  if bio_id is null then
    return;
  end if;

  if not exists (select 1 from timeline_events where biography_id = bio_id) then
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1918, 'Born in Mvezo, South Africa', 'Born into the Thembu royal family.', 0);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1944, 'Joins the African National Congress', 'Becomes active against apartheid.', 1);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1962, 'Arrested and Imprisoned', 'Sentenced to life imprisonment.', 2);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1990, 'Released from Prison', 'Walks free after 27 years.', 3);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1993, 'Awarded the Nobel Peace Prize', 'Shared with F.W. de Klerk.', 4);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1994, 'Elected President of South Africa', 'First democratically elected Black president.', 5);
  end if;

  if not exists (select 1 from achievements where biography_id = bio_id) then
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '1993', 'Nobel Peace Prize', 'For ending apartheid peacefully.', 0);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '1994', 'First Black President', 'South Africa''s first free election.', 1);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '27', 'Years of Imprisonment', 'Without abandoning his cause.', 2);
  end if;

  if not exists (select 1 from quotes where biography_id = bio_id) then
    insert into quotes (biography_id, text, attribution, featured, sort_order) values (bio_id, '"It always seems impossible until it''s done."', 'Nelson Mandela', true, 0);
  end if;

  if not exists (select 1 from facts where biography_id = bio_id) then
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'He studied law while in prison.', 'Known as ''Robben Island University.''', 0);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'He chose reconciliation over revenge.', 'Established the Truth and Reconciliation Commission.', 1);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'His autobiography was partly written in secret.', 'Pages smuggled out by fellow prisoners.', 2);
  end if;

  if not exists (select 1 from sources where biography_id = bio_id) then
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Nelson Mandela Foundation', 'Official archives', 0);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Nobel Prize Organization', 'Peace Prize record', 1);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'South African History Archive', 'Historical record', 2);
  end if;

  insert into seo_metadata (biography_id, meta_title, meta_description, canonical_path)
  values (bio_id, 'Nelson Mandela | LifeLegends', 'A revolutionary leader and South Africa''s first Black president, whose 27 years of imprisonment made him a global symbol of resilience.', '/legends/mandela')
  on conflict (biography_id) do nothing;
end $$;



-- ============ A. P. J. Abdul Kalam ============
-- Idempotent: skip entirely if this legend was already seeded.
insert into biographies (slug, name, roles, birth_year, death_year, nationality, profession, tagline, intro, overview_title, overview, stats, featured, view_count, status)
select 'kalam', 'A. P. J. Abdul Kalam', ARRAY['Scientist','Engineer','President']::text[], 1931, 2015,
    'Indian', 'Aerospace Scientist & President', '"Dream, dream, dream. Dreams transform into thoughts, and thoughts result in action."', 'India''s ''Missile Man,'' an aerospace scientist who rose to lead India''s missile and space programs, and later served as the country''s 11th President.',
    'From Rameswaram to Rashtrapati Bhavan', ARRAY['Born in 1931 in Rameswaram, Tamil Nadu, Kalam sold newspapers before pursuing aeronautical engineering.','He became central to India''s space and defense programs, earning the nickname ''Missile Man.''','In 2002 he was elected the 11th President of India, known as the ''People''s President.''']::text[], '[{"value": 1998, "label": "Pokhran-II Tests"}, {"value": 2002, "label": "Elected President"}, {"value": 7, "label": "Honorary Doctorates"}, {"value": "\u221e", "label": "Impact"}]'::jsonb,
    true, 15300, 'published'
where not exists (select 1 from biographies where slug = 'kalam');

insert into biography_categories (biography_id, category_id, is_primary)
select b.id, c.id, true
from biographies b, categories c
where b.slug = 'kalam' and c.slug = 'scientists'
and not exists (
  select 1 from biography_categories bc where bc.biography_id = b.id and bc.category_id = c.id
);

-- Child rows only inserted if this biography has none yet (idempotent re-run safety).
do $$
declare bio_id uuid;
begin
  select id into bio_id from biographies where slug = 'kalam';
  if bio_id is null then
    return;
  end if;

  if not exists (select 1 from timeline_events where biography_id = bio_id) then
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1931, 'Born in Rameswaram', 'Sold newspapers to support his studies.', 0);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1960, 'Joins Aeronautical Development', 'Begins his scientific career.', 1);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1980, 'Leads SLV-III Launch', 'India''s first satellite launch vehicle.', 2);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1998, 'Pokhran-II Nuclear Tests', 'Serves as Chief Scientific Adviser.', 3);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 2002, 'Elected President of India', 'Becomes the 11th President.', 4);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 2015, 'Passes Away While Teaching', 'Collapses while lecturing at IIM Shillong.', 5);
  end if;

  if not exists (select 1 from achievements where biography_id = bio_id) then
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, 'SLV-III', 'Satellite Launch Vehicle', 'India''s first successful launch vehicle.', 0);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '2002', '11th President of India', 'Celebrated for youth outreach.', 1);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, 'Bharat Ratna', 'India''s Highest Civilian Honor', 'Awarded in 1997.', 2);
  end if;

  if not exists (select 1 from quotes where biography_id = bio_id) then
    insert into quotes (biography_id, text, attribution, featured, sort_order) values (bio_id, '"Dream, dream, dream. Dreams transform into thoughts, and thoughts result in action."', 'A. P. J. Abdul Kalam', true, 0);
  end if;

  if not exists (select 1 from facts where biography_id = bio_id) then
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'He never married.', 'Lived simply, giving away book royalties.', 0);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'He played the veena.', 'A traditional South Indian instrument.', 1);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'He wrote Wings of Fire.', 'One of India''s most widely read books.', 2);
  end if;

  if not exists (select 1 from sources where biography_id = bio_id) then
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Government of India, Press Information Bureau', 'Official record', 0);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'ISRO', 'Institutional history', 1);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'DRDO', 'Program history record', 2);
  end if;

  insert into seo_metadata (biography_id, meta_title, meta_description, canonical_path)
  values (bio_id, 'A. P. J. Abdul Kalam | LifeLegends', 'India''s ''Missile Man,'' an aerospace scientist who rose to lead India''s missile and space programs, and later served as the country''s 11th President.', '/legends/kalam')
  on conflict (biography_id) do nothing;
end $$;



-- ============ Chhatrapati Shivaji Maharaj ============
-- Idempotent: skip entirely if this legend was already seeded.
insert into biographies (slug, name, roles, birth_year, death_year, nationality, profession, tagline, intro, overview_title, overview, stats, featured, view_count, status)
select 'shivaji', 'Chhatrapati Shivaji Maharaj', ARRAY['Founder','Military Strategist','King']::text[], 1630, 1680,
    'Indian (Maratha)', 'Founder of the Maratha Empire', '"Self-respect is the foundation on which all other virtues are built."', 'A visionary military strategist who founded the Maratha Empire in 17th-century India, celebrated for guerrilla tactics and progressive governance.',
    'The Founder of the Maratha Empire', ARRAY['Born in 1630 at Shivneri Fort, Shivaji grew up amid Deccan political turbulence.','Through strategic fort-building and guerrilla tactics, he carved out an independent Maratha kingdom.','In 1674 he was crowned Chhatrapati at Raigad, known for tolerance and naval investment.']::text[], '[{"value": 1674, "label": "Crowned Chhatrapati"}, {"value": 300, "label": "Forts Held or Built"}, {"value": 50, "label": "Years of Rule Founded"}, {"value": "\u221e", "label": "Impact"}]'::jsonb,
    false, 11200, 'published'
where not exists (select 1 from biographies where slug = 'shivaji');

insert into biography_categories (biography_id, category_id, is_primary)
select b.id, c.id, true
from biographies b, categories c
where b.slug = 'shivaji' and c.slug = 'politicians'
and not exists (
  select 1 from biography_categories bc where bc.biography_id = b.id and bc.category_id = c.id
);

-- Child rows only inserted if this biography has none yet (idempotent re-run safety).
do $$
declare bio_id uuid;
begin
  select id into bio_id from biographies where slug = 'shivaji';
  if bio_id is null then
    return;
  end if;

  if not exists (select 1 from timeline_events where biography_id = bio_id) then
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1630, 'Born at Shivneri Fort', 'Born to Shahaji Bhonsale and Jijabai.', 0);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1645, 'Early Campaigns Begin', 'Captures forts in the Sahyadri hills.', 1);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1659, 'Defeats Afzal Khan', 'Decisive encounter at Pratapgad.', 2);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1666, 'Escapes Agra Captivity', 'Famous escape from Mughal court arrest.', 3);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1674, 'Coronation at Raigad', 'Crowned Chhatrapati, sovereign kingdom.', 4);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1680, 'Passes Away at Raigad', 'Leaves a kingdom that expanded into an empire.', 5);
  end if;

  if not exists (select 1 from achievements where biography_id = bio_id) then
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '1674', 'Coronation as Chhatrapati', 'Independent sovereign kingdom.', 0);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '300', 'Fort Network', 'Hill and coastal forts across western India.', 1);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, 'Navy', 'Naval Innovation', 'Defended the Konkan coastline.', 2);
  end if;

  if not exists (select 1 from quotes where biography_id = bio_id) then
    insert into quotes (biography_id, text, attribution, featured, sort_order) values (bio_id, '"Self-respect is the foundation on which all other virtues are built."', 'Chhatrapati Shivaji Maharaj', true, 0);
  end if;

  if not exists (select 1 from facts where biography_id = bio_id) then
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'He built one of India''s first organized navies.', 'Defended the Konkan coastline.', 0);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'His administration is noted for religious tolerance.', 'Employed officials from multiple faiths.', 1);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'His escape from Agra became legendary.', 'Reportedly smuggled out in a basket of sweets.', 2);
  end if;

  if not exists (select 1 from sources where biography_id = bio_id) then
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya', 'Museum archive, Mumbai', 0);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Bharat Itihas Sanshodhak Mandal', 'Historical research record', 1);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'British Museum', 'Portrait and artifact collection', 2);
  end if;

  insert into seo_metadata (biography_id, meta_title, meta_description, canonical_path)
  values (bio_id, 'Chhatrapati Shivaji Maharaj | LifeLegends', 'A visionary military strategist who founded the Maratha Empire in 17th-century India, celebrated for guerrilla tactics and progressive governance.', '/legends/shivaji')
  on conflict (biography_id) do nothing;
end $$;



-- ============ Mahatma Gandhi ============
-- Idempotent: skip entirely if this legend was already seeded.
insert into biographies (slug, name, roles, birth_year, death_year, nationality, profession, tagline, intro, overview_title, overview, stats, featured, view_count, status)
select 'gandhi', 'Mahatma Gandhi', ARRAY['Leader','Activist','Philosopher']::text[], 1869, 1948,
    'Indian', 'Independence Leader', '"Be the change that you wish to see in the world."', 'The leader of India''s independence movement, whose philosophy of nonviolent resistance inspired freedom movements around the world.',
    'The Architect of Nonviolent Resistance', ARRAY['Born in 1869 in Porbandar, Gandhi trained as a barrister before developing Satyagraha in South Africa.','Returning to India in 1915, he became the central figure of the independence movement.','His philosophy influenced civil rights movements worldwide before his 1948 assassination.']::text[], '[{"value": 1930, "label": "Salt March"}, {"value": 21, "label": "Years in South Africa"}, {"value": 1947, "label": "India''s Independence"}, {"value": "\u221e", "label": "Impact"}]'::jsonb,
    true, 21400, 'published'
where not exists (select 1 from biographies where slug = 'gandhi');

insert into biography_categories (biography_id, category_id, is_primary)
select b.id, c.id, true
from biographies b, categories c
where b.slug = 'gandhi' and c.slug = 'freedom-fighters'
and not exists (
  select 1 from biography_categories bc where bc.biography_id = b.id and bc.category_id = c.id
);

-- Child rows only inserted if this biography has none yet (idempotent re-run safety).
do $$
declare bio_id uuid;
begin
  select id into bio_id from biographies where slug = 'gandhi';
  if bio_id is null then
    return;
  end if;

  if not exists (select 1 from timeline_events where biography_id = bio_id) then
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1869, 'Born in Porbandar', 'Born into a Hindu merchant-caste family.', 0);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1893, 'Moves to South Africa', 'Begins organizing against discrimination.', 1);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1915, 'Returns to India', 'Assumes leadership in the Congress.', 2);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1930, 'Leads the Salt March', '240-mile march defying the salt tax.', 3);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1942, 'Launches Quit India Movement', 'Calls for an end to British rule.', 4);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1948, 'Assassinated in Delhi', 'Months after India''s independence.', 5);
  end if;

  if not exists (select 1 from achievements where biography_id = bio_id) then
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, 'Satyagraha', 'Philosophy of Nonviolence', 'Nonviolent civil resistance.', 0);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '1930', 'Salt March', 'Iconic act of civil disobedience.', 1);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '1947', 'India''s Independence', 'Ended British colonial rule.', 2);
  end if;

  if not exists (select 1 from quotes where biography_id = bio_id) then
    insert into quotes (biography_id, text, attribution, featured, sort_order) values (bio_id, '"Be the change that you wish to see in the world."', 'Mahatma Gandhi', true, 0);
  end if;

  if not exists (select 1 from facts where biography_id = bio_id) then
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'He trained as a barrister in London.', 'University College London.', 0);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'His South Africa years shaped his philosophy.', '21 years confronting discrimination.', 1);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'He was nominated for the Nobel Peace Prize five times.', 'Never awarded it.', 2);
  end if;

  if not exists (select 1 from sources where biography_id = bio_id) then
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Sabarmati Ashram Preservation Trust', 'Archival record', 0);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'National Gandhi Museum, New Delhi', 'Historical collection', 1);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Nobel Prize Organization', 'Nomination record', 2);
  end if;

  insert into seo_metadata (biography_id, meta_title, meta_description, canonical_path)
  values (bio_id, 'Mahatma Gandhi | LifeLegends', 'The leader of India''s independence movement, whose philosophy of nonviolent resistance inspired freedom movements around the world.', '/legends/gandhi')
  on conflict (biography_id) do nothing;
end $$;



-- ============ Isaac Newton ============
-- Idempotent: skip entirely if this legend was already seeded.
insert into biographies (slug, name, roles, birth_year, death_year, nationality, profession, tagline, intro, overview_title, overview, stats, featured, view_count, status)
select 'newton', 'Isaac Newton', ARRAY['Physicist','Mathematician','Astronomer']::text[], 1643, 1727,
    'English', 'Physicist & Mathematician', '"If I have seen further, it is by standing on the shoulders of giants."', 'A physicist and mathematician whose laws of motion and universal gravitation became the foundation of classical physics.',
    'The Foundation of Classical Physics', ARRAY['Born in 1642 (Old Style) in Woolsthorpe, Newton enrolled at Trinity College, Cambridge.','During plague closures in the 1660s, he laid groundwork for calculus, optics, and gravitation.','His 1687 Principia formalized the laws of motion, standing until Einstein''s relativity.']::text[], '[{"value": 1687, "label": "Principia Published"}, {"value": 3, "label": "Laws of Motion"}, {"value": 1705, "label": "Knighted"}, {"value": "\u221e", "label": "Impact"}]'::jsonb,
    false, 16800, 'published'
where not exists (select 1 from biographies where slug = 'newton');

insert into biography_categories (biography_id, category_id, is_primary)
select b.id, c.id, true
from biographies b, categories c
where b.slug = 'newton' and c.slug = 'scientists'
and not exists (
  select 1 from biography_categories bc where bc.biography_id = b.id and bc.category_id = c.id
);

-- Child rows only inserted if this biography has none yet (idempotent re-run safety).
do $$
declare bio_id uuid;
begin
  select id into bio_id from biographies where slug = 'newton';
  if bio_id is null then
    return;
  end if;

  if not exists (select 1 from timeline_events where biography_id = bio_id) then
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1643, 'Born in Woolsthorpe, England', 'Born prematurely on Christmas Day.', 0);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1661, 'Enrolls at Trinity College', 'Begins studies at Cambridge.', 1);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1666, 'The Year of Wonders', 'Develops calculus, optics, gravitation.', 2);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1687, 'Publishes the Principia', 'Formalizes the laws of motion.', 3);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1705, 'Knighted by Queen Anne', 'Becomes Sir Isaac Newton.', 4);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1727, 'Passes Away in London', 'Buried at Westminster Abbey.', 5);
  end if;

  if not exists (select 1 from achievements where biography_id = bio_id) then
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '1687', 'Principia Mathematica', 'Laws of motion and gravitation.', 0);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, 'Calculus', 'Mathematical Foundations', 'Developed alongside Leibniz.', 1);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, 'Optics', 'Theory of Light', 'White light as a spectrum of colors.', 2);
  end if;

  if not exists (select 1 from quotes where biography_id = bio_id) then
    insert into quotes (biography_id, text, attribution, featured, sort_order) values (bio_id, '"If I have seen further, it is by standing on the shoulders of giants."', 'Isaac Newton', true, 0);
  end if;

  if not exists (select 1 from facts where biography_id = bio_id) then
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'He served as Master of the Royal Mint.', 'Pursued counterfeiters rigorously.', 0);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'He developed calculus independently of Leibniz.', 'Led to a famous priority dispute.', 1);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'He was deeply engaged in alchemy and theology.', 'Largely kept private during his life.', 2);
  end if;

  if not exists (select 1 from sources where biography_id = bio_id) then
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'The Royal Society', 'Historical archive', 0);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Trinity College, Cambridge', 'Academic archive', 1);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Royal Collection Trust', 'Portrait provenance', 2);
  end if;

  insert into seo_metadata (biography_id, meta_title, meta_description, canonical_path)
  values (bio_id, 'Isaac Newton | LifeLegends', 'A physicist and mathematician whose laws of motion and universal gravitation became the foundation of classical physics.', '/legends/newton')
  on conflict (biography_id) do nothing;
end $$;



-- ============ Ada Lovelace ============
-- Idempotent: skip entirely if this legend was already seeded.
insert into biographies (slug, name, roles, birth_year, death_year, nationality, profession, tagline, intro, overview_title, overview, stats, featured, view_count, status)
select 'lovelace', 'Ada Lovelace', ARRAY['Mathematician','Writer','Programmer']::text[], 1815, 1852,
    'English', 'Mathematician & Writer', '"That brain of mine is something more than merely mortal."', 'The daughter of Lord Byron, Ada Lovelace worked with Charles Babbage and wrote what is considered the first algorithm intended for machine computation.',
    'The First Computer Programmer', ARRAY['Born in 1815, Ada Byron was raised with a rigorous mathematics education.','As Countess of Lovelace, she translated and annotated a paper on Babbage''s Analytical Engine.','Her notes described an algorithm to compute Bernoulli numbers, the first published computer program.']::text[], '[{"value": 1843, "label": "Notes Published"}, {"value": 1, "label": "First Algorithm"}, {"value": 1980, "label": "Ada Language Named For Her"}, {"value": "\u221e", "label": "Impact"}]'::jsonb,
    false, 13700, 'published'
where not exists (select 1 from biographies where slug = 'lovelace');

insert into biography_categories (biography_id, category_id, is_primary)
select b.id, c.id, true
from biographies b, categories c
where b.slug = 'lovelace' and c.slug = 'inventors'
and not exists (
  select 1 from biography_categories bc where bc.biography_id = b.id and bc.category_id = c.id
);

-- Child rows only inserted if this biography has none yet (idempotent re-run safety).
do $$
declare bio_id uuid;
begin
  select id into bio_id from biographies where slug = 'lovelace';
  if bio_id is null then
    return;
  end if;

  if not exists (select 1 from timeline_events where biography_id = bio_id) then
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1815, 'Born in London', 'Daughter of Lord Byron and Anne Isabella Milbanke.', 0);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1833, 'Meets Charles Babbage', 'Sparks a lifelong collaboration.', 1);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1835, 'Becomes Countess of Lovelace', 'Marries William King.', 2);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1843, 'Publishes Her Notes', 'Includes an algorithm for Bernoulli numbers.', 3);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1852, 'Passes Away in London', 'Buried next to her father.', 4);
    insert into timeline_events (biography_id, year, title, description, sort_order) values (bio_id, 1980, 'The Ada Programming Language', 'Named in her honor by the US DoD.', 5);
  end if;

  if not exists (select 1 from achievements where biography_id = bio_id) then
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, '1843', 'First Published Algorithm', 'For the Analytical Engine.', 0);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, 'Ada', 'Programming Language Namesake', 'Named in her honor in 1980.', 1);
    insert into achievements (biography_id, counter, title, description, sort_order) values (bio_id, 'Vision', 'Beyond Calculation', 'Foresaw computers creating music and art.', 2);
  end if;

  if not exists (select 1 from quotes where biography_id = bio_id) then
    insert into quotes (biography_id, text, attribution, featured, sort_order) values (bio_id, '"That brain of mine is something more than merely mortal."', 'Ada Lovelace', true, 0);
  end if;

  if not exists (select 1 from facts where biography_id = bio_id) then
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'Her mother pushed her toward mathematics.', 'To avoid her father''s perceived instability.', 0);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'She foresaw computers doing more than arithmetic.', 'Speculated on composing music.', 1);
    insert into facts (biography_id, summary, expand, sort_order) values (bio_id, 'A major programming language is named after her.', 'Ada, by the US DoD in 1980.', 2);
  end if;

  if not exists (select 1 from sources where biography_id = bio_id) then
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Bodleian Library, Oxford', 'Lovelace-Babbage correspondence', 0);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Science Museum, London', 'Analytical Engine collection', 1);
    insert into sources (biography_id, name, description, sort_order) values (bio_id, 'Government Art Collection, UK', 'Portrait provenance', 2);
  end if;

  insert into seo_metadata (biography_id, meta_title, meta_description, canonical_path)
  values (bio_id, 'Ada Lovelace | LifeLegends', 'The daughter of Lord Byron, Ada Lovelace worked with Charles Babbage and wrote what is considered the first algorithm intended for machine computation.', '/legends/lovelace')
  on conflict (biography_id) do nothing;
end $$;


