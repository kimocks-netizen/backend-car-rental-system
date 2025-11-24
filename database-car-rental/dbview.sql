-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  car_id uuid NOT NULL,
  manager_id uuid,
  pickup_date date NOT NULL,
  return_date date NOT NULL,
  total_days integer NOT NULL,
  rental_amount numeric NOT NULL,
  deposit_amount numeric NOT NULL,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'active'::text, 'returned'::text, 'completed'::text, 'cancelled'::text])),
  pickup_notes text,
  return_notes text,
  damage_level text CHECK (damage_level = ANY (ARRAY['none'::text, 'minor'::text, 'major'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT bookings_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(id),
  CONSTRAINT bookings_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.cars (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  type text CHECK (type = ANY (ARRAY['sedan'::text, 'suv'::text, 'hatchback'::text, 'luxury'::text, 'van'::text])),
  year integer NOT NULL,
  daily_rate numeric NOT NULL,
  fuel_type text CHECK (fuel_type = ANY (ARRAY['petrol'::text, 'diesel'::text, 'electric'::text, 'hybrid'::text])),
  transmission text CHECK (transmission = ANY (ARRAY['manual'::text, 'automatic'::text])),
  capacity integer NOT NULL,
  mileage integer,
  availability_status text DEFAULT 'available'::text CHECK (availability_status = ANY (ARRAY['available'::text, 'unavailable'::text, 'maintenance'::text])),
  image_url text,
  description text,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cars_pkey PRIMARY KEY (id),
  CONSTRAINT cars_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL,
  payment_type text CHECK (payment_type = ANY (ARRAY['rental'::text, 'deposit'::text, 'refund'::text])),
  amount numeric NOT NULL,
  payment_method text DEFAULT 'card'::text,
  transaction_id text UNIQUE,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'refunded'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  cust_address text,
  license_number text,
  user_role text DEFAULT 'customer'::text CHECK (user_role = ANY (ARRAY['customer'::text, 'staff'::text, 'admin'::text])),
  user_status text DEFAULT 'active'::text CHECK (user_status = ANY (ARRAY['active'::text, 'suspended'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.refunds (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL,
  manager_id uuid NOT NULL,
  reason text NOT NULL,
  original_deposit numeric NOT NULL,
  amount_refunded numeric NOT NULL,
  refund_status text DEFAULT 'pending'::text CHECK (refund_status = ANY (ARRAY['pending'::text, 'approved'::text, 'processed'::text, 'rejected'::text])),
  approved_by_admin boolean DEFAULT false,
  admin_notes text,
  created_at timestamp with time zone DEFAULT now(),
  processed_at timestamp with time zone,
  CONSTRAINT refunds_pkey PRIMARY KEY (id),
  CONSTRAINT refunds_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id),
  CONSTRAINT refunds_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.profiles(id)
);