ALTER TABLE public.profiles ALTER COLUMN mobile DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN status SET DEFAULT 'approved'::approval_status;
UPDATE public.profiles SET status = 'approved' WHERE status <> 'approved';