drop database if exists bamazon;
create database if not exists bamazon;

use bamazon;

create table products (
  sku int unique,
  product_name varchar(45) null,
  department_name varchar(45) not null,
  price decimal(10,2),
  stock_quantity int,
  primary key (sku)
);