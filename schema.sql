-- Chu Adventure 1.5. Run in the project's Supabase SQL Editor as postgres.
-- Safe to rerun for this schema version. No existing rows or auth users are removed.
begin;
create schema if not exists chu_private;
revoke all on schema chu_private from public, anon;
grant usage on schema chu_private to authenticated;
create table if not exists chu_private.admins (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table chu_private.admins enable row level security;
revoke all on chu_private.admins from public, anon, authenticated;
create or replace function chu_private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists(select 1 from chu_private.admins where user_id=(select auth.uid()));
$$;
revoke all on function chu_private.is_admin() from public,anon;
grant execute on function chu_private.is_admin() to authenticated;
create table if not exists public.chu_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check(length(display_name)<=150),
 email text not null check(length(email)<=320),
 registered_at timestamptz not null default now(),
 last_seen_at timestamptz not null default now()
);
create table if not exists public.chu_progress (
 user_id uuid not null references auth.users(id) on delete cascade,
 chapter_id text not null default 'chapter-1' check(chapter_id in ('chapter-1','chapter-2','chapter-3','chapter-4')),
 snapshot jsonb not null check(jsonb_typeof(snapshot)='object' and octet_length(snapshot::text)<=65536),
 revision bigint not null default 1 check(revision>0),
 updated_at timestamptz not null default now(),
 primary key(user_id,chapter_id)
);
alter table public.chu_progress drop constraint if exists chu_progress_chapter_id_check;
alter table public.chu_progress add constraint chu_progress_chapter_id_check check(chapter_id in ('chapter-1','chapter-2','chapter-3','chapter-4'));
alter table public.chu_profiles enable row level security;
alter table public.chu_progress enable row level security;
revoke all on public.chu_profiles,public.chu_progress from public,anon,authenticated;
grant select,insert,update on public.chu_profiles,public.chu_progress to authenticated;
drop policy if exists chu_profiles_read on public.chu_profiles;
create policy chu_profiles_read on public.chu_profiles for select to authenticated using ((select auth.uid())=user_id or (select chu_private.is_admin()));
drop policy if exists chu_profiles_insert on public.chu_profiles;
create policy chu_profiles_insert on public.chu_profiles for insert to authenticated with check ((select auth.uid())=user_id and email=coalesce(auth.jwt()->>'email',''));
drop policy if exists chu_profiles_update on public.chu_profiles;
create policy chu_profiles_update on public.chu_profiles for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id and email=coalesce(auth.jwt()->>'email',''));
drop policy if exists chu_progress_read on public.chu_progress;
create policy chu_progress_read on public.chu_progress for select to authenticated using ((select auth.uid())=user_id or (select chu_private.is_admin()));
drop policy if exists chu_progress_insert on public.chu_progress;
create policy chu_progress_insert on public.chu_progress for insert to authenticated with check ((select auth.uid())=user_id);
drop policy if exists chu_progress_update on public.chu_progress;
create policy chu_progress_update on public.chu_progress for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create or replace function public.chu_sync_profile() returns void
language plpgsql security invoker set search_path='' as $$
begin
 if auth.uid() is null or coalesce(auth.jwt()->>'is_anonymous','false')='true' then raise exception 'CHU_LOGIN_REQUIRED'; end if;
 insert into public.chu_profiles(user_id,email,display_name,last_seen_at)
 values(auth.uid(),coalesce(auth.jwt()->>'email',''),left(coalesce(auth.jwt()->'user_metadata'->>'full_name',''),150),now())
 on conflict(user_id) do update set email=excluded.email,display_name=excluded.display_name,last_seen_at=now();
end;$$;
create or replace function public.chu_save_progress(p_snapshot jsonb,p_expected_revision bigint) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare saved public.chu_progress;
begin
 if auth.uid() is null or coalesce(auth.jwt()->>'is_anonymous','false')='true' then raise exception 'CHU_LOGIN_REQUIRED'; end if;
 if p_snapshot is null or p_snapshot->>'version' is distinct from '2' or coalesce(p_snapshot->>'chapterId','') not in ('chapter-1','chapter-2','chapter-3','chapter-4') or p_expected_revision is null or p_expected_revision<0 then raise exception 'CHU_INVALID_PROGRESS'; end if;
 if p_expected_revision=0 then
  insert into public.chu_progress(user_id,chapter_id,snapshot) values(auth.uid(),p_snapshot->>'chapterId',p_snapshot)
  on conflict(user_id,chapter_id) do nothing returning * into saved;
 else
  update public.chu_progress set snapshot=p_snapshot,revision=revision+1,updated_at=now()
  where user_id=auth.uid() and chapter_id=p_snapshot->>'chapterId' and revision=p_expected_revision returning * into saved;
 end if;
 if saved.user_id is null then raise exception 'CHU_CONFLICT'; end if;
 return jsonb_build_object('snapshot',saved.snapshot,'revision',saved.revision,'updated_at',saved.updated_at);
end;$$;
revoke all on function public.chu_sync_profile(),public.chu_save_progress(jsonb,bigint) from public,anon;
grant execute on function public.chu_sync_profile(),public.chu_save_progress(jsonb,bigint) to authenticated;
commit;
-- Verification: both results must show rowsecurity=true.
select tablename,rowsecurity from pg_tables where schemaname='public' and tablename in ('chu_profiles','chu_progress');
-- Optional admin: after YOUR Google login, copy YOUR UUID from Authentication > Users.
-- insert into chu_private.admins(user_id) values ('YOUR-USER-UUID') on conflict do nothing;
-- Never expose a service_role key or put admin roles in user_metadata.
