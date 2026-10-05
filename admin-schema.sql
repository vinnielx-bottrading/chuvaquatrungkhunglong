-- Chu 1.6: run AFTER schema.sql. Does not erase progress or users.
begin;
create table if not exists public.chu_catalog_draft(id int primary key check(id=1),config jsonb not null check(octet_length(config::text)<=262144),revision bigint not null default 1,updated_at timestamptz not null default now());
create table if not exists public.chu_catalog_public(id int primary key check(id=1),config jsonb not null check(octet_length(config::text)<=262144),updated_at timestamptz not null default now());
create table if not exists public.chu_catalog_history(id bigint generated always as identity primary key,config jsonb not null,actor uuid not null references auth.users(id),created_at timestamptz not null default now());
alter table public.chu_catalog_draft enable row level security;
alter table public.chu_catalog_public enable row level security;
alter table public.chu_catalog_history enable row level security;
revoke all on public.chu_catalog_draft,public.chu_catalog_public,public.chu_catalog_history from public,anon,authenticated;
grant select,update on public.chu_catalog_draft,public.chu_catalog_public to authenticated;
grant select on public.chu_catalog_public to anon;
grant select,insert on public.chu_catalog_history to authenticated;
grant usage on sequence public.chu_catalog_history_id_seq to authenticated;
drop policy if exists chu_draft_admin on public.chu_catalog_draft;
create policy chu_draft_admin on public.chu_catalog_draft for all to authenticated using ((select chu_private.is_admin())) with check ((select chu_private.is_admin()));
drop policy if exists chu_catalog_read on public.chu_catalog_public;
create policy chu_catalog_read on public.chu_catalog_public for select to anon,authenticated using (true);
drop policy if exists chu_catalog_write on public.chu_catalog_public;
create policy chu_catalog_write on public.chu_catalog_public for update to authenticated using ((select chu_private.is_admin())) with check ((select chu_private.is_admin()));
drop policy if exists chu_history_read on public.chu_catalog_history;
create policy chu_history_read on public.chu_catalog_history for select to authenticated using ((select chu_private.is_admin()));
drop policy if exists chu_history_append on public.chu_catalog_history;
create policy chu_history_append on public.chu_catalog_history for insert to authenticated with check ((select chu_private.is_admin()) and actor=(select auth.uid()));
create or replace function public.chu_admin_access() returns boolean language sql stable security invoker set search_path='' as $$ select chu_private.is_admin(); $$;
revoke all on function public.chu_admin_access() from public,anon;
grant execute on function public.chu_admin_access() to authenticated;
create or replace function public.chu_get_catalog() returns jsonb language sql stable security invoker set search_path='' as $$ select jsonb_build_object('config',config,'server_now',now()) from public.chu_catalog_public where id=1; $$;
revoke all on function public.chu_get_catalog() from public;
grant execute on function public.chu_get_catalog() to anon,authenticated;
create or replace function public.chu_save_draft(p_config jsonb,p_revision bigint) returns jsonb language plpgsql security invoker set search_path='' as $$
declare result public.chu_catalog_draft;
begin
 if not chu_private.is_admin() then raise exception 'CHU_FORBIDDEN'; end if;
 if p_config is null or jsonb_typeof(p_config) is distinct from 'object' or jsonb_typeof(p_config->'chapters') is distinct from 'array' then raise exception 'CHU_INVALID_CONFIG'; end if;
 if jsonb_array_length(p_config->'chapters') not between 1 and 100 or not exists(select 1 from jsonb_array_elements(p_config->'chapters') c where c->>'id'='chapter-1') then raise exception 'CHU_INVALID_CONFIG'; end if;
 update public.chu_catalog_draft set config=p_config,revision=revision+1,updated_at=now() where id=1 and revision=p_revision returning * into result;
 if result.id is null then raise exception 'CHU_CONFLICT'; end if;
 return jsonb_build_object('revision',result.revision);
end;$$;
create or replace function public.chu_publish_catalog(p_revision bigint) returns void language plpgsql security invoker set search_path='' as $$
declare draft public.chu_catalog_draft;
begin
 if not chu_private.is_admin() then raise exception 'CHU_FORBIDDEN'; end if;
 select * into draft from public.chu_catalog_draft where id=1 for update;
 if draft.revision is distinct from p_revision then raise exception 'CHU_CONFLICT'; end if;
 update public.chu_catalog_public set config=draft.config,updated_at=now() where id=1;
 insert into public.chu_catalog_history(config,actor) values(draft.config,auth.uid());
end;$$;
revoke all on function public.chu_save_draft(jsonb,bigint),public.chu_publish_catalog(bigint) from public,anon;
grant execute on function public.chu_save_draft(jsonb,bigint),public.chu_publish_catalog(bigint) to authenticated;
-- Public bucket contains game audio only. Never upload user data here.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('chu-audio','chu-audio',true,20971520,array['audio/mpeg','audio/ogg','audio/wav','audio/mp4']) on conflict(id) do nothing;
drop policy if exists chu_audio_admin_read on storage.objects;
create policy chu_audio_admin_read on storage.objects for select to authenticated using (bucket_id='chu-audio' and (select chu_private.is_admin()));
drop policy if exists chu_audio_admin_insert on storage.objects;
create policy chu_audio_admin_insert on storage.objects for insert to authenticated with check (bucket_id='chu-audio' and (select chu_private.is_admin()));
-- Audio uses unique filenames, no overwrite/delete from the admin app.
insert into public.chu_catalog_draft(id,config) values(1,$seed${"headline":"Mỗi trang mở ra một thế giới.","intro":"Cùng Chu khám phá thiên nhiên, kết bạn và học những điều nhỏ bé để lớn lên. Chuyến đi đầu tiên chỉ là khởi đầu.","chapters":[{"id":"chapter-1","title":"Quả trứng thất lạc","description":"Một cuốn truyện cũ, những dấu chân bí ẩn và chuyến đi cùng bố để đưa quả trứng về nhà.","status":"open","releaseAt":null,"stages":["Khu rừng thì thầm","Hang ánh sáng","Thung lũng bị lãng quên","Đường về tổ ấm"],"music":"","volume":0.65,"nature":0.65,"water":0.7,"stageAudio":{}},{"id":"chapter-2","title":"Lời hẹn cùng Du","description":"Một lời chào mở đầu tình bạn. Cùng Chu và Du đọc bản đồ, tìm dấu tích cổ xưa và học cách khám phá cùng nhau.","status":"soon","contentVersion":2,"releaseAt":null,"stages":["Một lời chào, một người bạn","Bản đồ dưới tán cây","Dấu tích trong đá","Lời hẹn trên đồi gió"],"music":"","volume":0.65,"nature":0.65,"water":0.7,"stageAudio":{}},{"id":"chapter-3","title":"Theo dòng sông xanh","description":"Men theo dòng nước uốn quanh chân núi, Chu và Du khám phá dấu tích sự sống, chọn lối đi an toàn và gìn giữ màu xanh của rừng.","status":"soon","contentVersion":2,"releaseAt":null,"stages":["Bến nước đầu rừng","Khúc quanh có cây cầu","Những trang đá cổ","Giữ màu xanh cho dòng sông"],"music":"","volume":0.65,"nature":0.65,"water":0.7,"stageAudio":{}},{"id":"chapter-4","title":"Thung lũng những người bạn lớn","description":"Gặp gỡ những dáng hình khác biệt: cổ dài, ba sừng, lưng giáp và đuôi chùy. Cùng Chu và Du hoàn thành sổ khám phá khủng long ăn thực vật.","status":"soon","contentVersion":2,"releaseAt":null,"stages":["Đồng cỏ cổ dài","Khu vườn ba sừng","Lối đi giữa những tấm giáp","Cuốn sổ của hai nhà khám phá"],"music":"","volume":0.65,"nature":0.65,"water":0.7,"stageAudio":{}}]}$seed$::jsonb) on conflict(id) do nothing;
insert into public.chu_catalog_public(id,config) select id,config from public.chu_catalog_draft where id=1 on conflict(id) do nothing;
commit;
-- Grant admin to YOUR exact Auth UUID after Google login (replace placeholder):
-- insert into chu_private.admins(user_id) values('YOUR-USER-UUID') on conflict do nothing;
