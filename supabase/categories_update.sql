-- Voeg de parent_id kolom toe aan categories
alter table categories add column if not exists parent_id uuid references categories(id) on delete cascade;

-- Aangezien je met een schone lei begint voor de categorieën:
-- Verwijder alle test/bestaande producten en categorieën:
delete from order_items;
delete from orders;
delete from products;
delete from categories;

-- Voeg de 5 nieuwe hoofdcategorieën toe
insert into categories (slug, name, sort_order) values
('interieur', 'Interieur', 1),
('exterieur', 'Exterieur', 2),
('droogdoeken', 'Droogdoeken', 3),
('washandschoenen', 'Washandschoenen', 4),
('accessoires', 'Accessoires', 5);

-- Voorbeeld van een subcategorie:
-- insert into categories (parent_id, slug, name, sort_order) values 
-- ((select id from categories where slug = 'interieur'), 'glasreiniger', 'Glasreiniger', 1);
