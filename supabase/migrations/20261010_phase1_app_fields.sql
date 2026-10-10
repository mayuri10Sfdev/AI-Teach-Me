alter table public.learning_sessions
  add column if not exists distractions_count integer not null default 0
    check (distractions_count >= 0),
  add column if not exists questions_count integer not null default 0
    check (questions_count >= 0);

insert into public.topics (name, slug) values
  ('Cybersecurity', 'cybersecurity'),
  ('Web Development', 'web-development'),
  ('Finance', 'finance'),
  ('Marketing', 'marketing'),
  ('UI/UX', 'ui-ux'),
  ('Leadership', 'leadership')
on conflict (slug) do nothing;
