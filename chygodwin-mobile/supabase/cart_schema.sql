create table if not exists public.cart_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  product_name text not null,
  product_image text not null,
  price numeric(12, 2) not null check (price >= 0),
  quantity integer not null default 1 check (quantity > 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

alter table public.cart_items enable row level security;

drop policy if exists "Users can read their cart items" on public.cart_items;
create policy "Users can read their cart items"
  on public.cart_items for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their cart items" on public.cart_items;
create policy "Users can insert their cart items"
  on public.cart_items for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their cart items" on public.cart_items;
create policy "Users can update their cart items"
  on public.cart_items for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their cart items" on public.cart_items;
create policy "Users can delete their cart items"
  on public.cart_items for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.cart_items to authenticated;

create or replace function public.add_cart_item(
  p_product_id text,
  p_product_name text,
  p_product_image text,
  p_price numeric
)
returns public.cart_items
language plpgsql
security invoker
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  saved_item public.cart_items;
begin
  if current_user_id is null then
    raise exception 'Authentication is required to update the cart';
  end if;

  insert into public.cart_items (
    user_id, product_id, product_name, product_image, price, quantity, updated_at
  ) values (
    current_user_id, p_product_id, p_product_name, p_product_image, p_price, 1, now()
  )
  on conflict (user_id, product_id) do update
    set product_name = excluded.product_name,
        product_image = excluded.product_image,
        price = excluded.price,
        quantity = public.cart_items.quantity + 1,
        updated_at = now()
  returning * into saved_item;

  return saved_item;
end;
$$;

revoke all on function public.add_cart_item(text, text, text, numeric) from public;
grant execute on function public.add_cart_item(text, text, text, numeric) to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'cart_items'
  ) then
    execute 'alter publication supabase_realtime add table public.cart_items';
  end if;
end;
$$;