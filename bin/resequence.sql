select
  'select setval(' ||
  quote_literal(
    quote_ident(PGT.schemaname) || '.' || quote_ident(S.relname)
  ) ||
  ', coalesce(max(' ||
  quote_ident(C.attname) ||
  '), 1) ) from ' ||
  quote_ident(PGT.schemaname) || '.' || quote_ident(T.relname) ||
  ';'
from
  pg_class as S,
  pg_depend as D,
  pg_class as T,
  pg_attribute as C,
  pg_tables as PGT
where
  S.relkind = 'S'
  and S.oid = D.objid
  and D.refobjid = T.oid
  and D.refobjid = C.attrelid
  and D.refobjsubid = C.attnum
  and T.relname = PGT.tablename
order by S.relname;
