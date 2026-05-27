from supabase import Client, create_client

from .settings import SUPABASE_ANON_KEY, SUPABASE_URL

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise RuntimeError("Supabase credentials are not configured")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
