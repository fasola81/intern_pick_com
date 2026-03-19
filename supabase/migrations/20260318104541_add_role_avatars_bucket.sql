insert into storage.buckets (id, name, public)
values ('role-avatars', 'role-avatars', true)
on conflict (id) do nothing;

drop policy if exists "Role avatars are publicly accessible" on storage.objects;
create policy "Role avatars are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'role-avatars' );

drop policy if exists "Anyone can upload a role avatar" on storage.objects;
create policy "Anyone can upload a role avatar"
  on storage.objects for insert
  with check ( bucket_id = 'role-avatars' );

drop policy if exists "Users can update their own role avatars" on storage.objects;
create policy "Users can update their own role avatars"
  on storage.objects for update
  using ( bucket_id = 'role-avatars' );

