CREATE TABLE public.products (
	sku varchar(20) NOT NULL,
	"name" varchar NOT NULL,
	image varchar NOT NULL,
	price numeric(15, 2) NOT NULL,
	description text NULL,
	CONSTRAINT products_pk PRIMARY KEY (sku)
);

CREATE TABLE public.adjustment_transactions (
	id serial4 NOT NULL,
	sku varchar(20) NOT NULL,
	qty numeric(5, 2) NOT NULL,
	CONSTRAINT adjustment_transactions_pk PRIMARY KEY (id),
	CONSTRAINT adjustment_transactions_fk FOREIGN KEY (sku) REFERENCES public.products(sku) ON DELETE CASCADE ON UPDATE CASCADE
);