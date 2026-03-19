insert into storage.buckets (id, name, public)
values ('role-avatars', 'role-avatars', true)
on conflict (id) do nothing;

create policy "Role avatars are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'role-avatars' );

create policy "Anyone can upload a role avatar"
  on storage.objects for insert
  with check ( bucket_id = 'role-avatars' );
  
create policy "Users can update their own role avatars"
  on storage.objects for update
  using ( bucket_id = 'role-avatars' );
