truncate table products;

insert into products(sku, product_name, department_name, price, stock_quantity)
values(1, "Fujifilm X-H1 (Body Only)", "Cameras", 1899.00, 21);

insert into products(sku, product_name, department_name, price, stock_quantity)
values(2, "Samsung Galaxy S10 (Black)", "Smartphones", 999.00, 123);

insert into products(sku, product_name, department_name, price, stock_quantity)
values(3, "Sony WH-1000XM3 Wireless Headphones", "Electronics", 349.00, 100);

insert into products(sku, product_name, department_name, price, stock_quantity)
values(4, "Apple MacBook Pro with Touch Bar (15.4)", "Computers and Laptops", 2499.00, 5);

insert into products(sku, product_name, department_name, price, stock_quantity)
values(5, "Microsoft Xbox S", "Video Games", 349.00, 999);

insert into products(sku, product_name, department_name, price, stock_quantity)
values(6, "Google Pixel 3a", "Smartphones", 299.00, 999);

insert into products(sku, product_name, department_name, price, stock_quantity)
values(7, "Nintendo Switch", "Video Games", 249.00, 23);

insert into products(sku, product_name, department_name, price, stock_quantity)
values(8, "Dell XPS", "Computers and Laptops", 1899.00, 765);

insert into products(sku, product_name, department_name, price, stock_quantity)
values(9, "Bose SoundSport", "Electronics", 199.00, 1230);

insert into products(sku, product_name, department_name, price, stock_quantity)
values(10, "Apple AirPods 2", "Electronics", 199.00, 1230);

select * from products;