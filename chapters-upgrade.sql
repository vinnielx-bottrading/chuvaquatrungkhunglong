-- Chu v1.7: run once after schema.sql and admin-schema.sql. Safe to rerun.
-- Expands progress slots only. Does NOT publish or open chapters or modify player saves.
begin;
alter table public.chu_progress drop constraint if exists chu_progress_chapter_id_check;
alter table public.chu_progress add constraint chu_progress_chapter_id_check check(chapter_id in ('chapter-1','chapter-2','chapter-3','chapter-4'));
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
revoke all on function public.chu_save_progress(jsonb,bigint) from public,anon;
grant execute on function public.chu_save_progress(jsonb,bigint) to authenticated;
commit;
