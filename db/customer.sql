-- public.customer definition

-- Drop table

-- DROP TABLE public.customer;

CREATE TABLE public.customer (
	customer_id SERIAL,
	first_name varchar(50) NOT NULL,
	last_name varchar(50) NOT NULL,
	email varchar(50) NOT NULL,
	contact int2 NULL,
	company varchar(50) NOT NULL,
	created_date information_schema."time_stamp" NOT NULL,
	"password" varchar(50) NOT NULL
);