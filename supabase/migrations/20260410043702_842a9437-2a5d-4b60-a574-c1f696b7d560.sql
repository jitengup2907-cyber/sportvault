
-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Academies
CREATE TABLE public.academies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  owner_id UUID NOT NULL,
  sport_focus TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.academies ENABLE ROW LEVEL SECURITY;

-- Academy members (multi-academy support)
CREATE TABLE public.academy_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'coach',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(academy_id, user_id)
);
ALTER TABLE public.academy_members ENABLE ROW LEVEL SECURITY;

-- Security definer function for academy membership check
CREATE OR REPLACE FUNCTION public.is_academy_member(_user_id UUID, _academy_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.academy_members
    WHERE user_id = _user_id AND academy_id = _academy_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_academy_owner(_user_id UUID, _academy_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.academies
    WHERE id = _academy_id AND owner_id = _user_id
  );
$$;

-- Academy RLS
CREATE POLICY "Members can view their academies" ON public.academies FOR SELECT USING (public.is_academy_member(auth.uid(), id) OR owner_id = auth.uid());
CREATE POLICY "Owners can insert academies" ON public.academies FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update academies" ON public.academies FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete academies" ON public.academies FOR DELETE USING (auth.uid() = owner_id);

-- Academy members RLS
CREATE POLICY "Members can view their academy members" ON public.academy_members FOR SELECT USING (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Owners can manage members" ON public.academy_members FOR INSERT WITH CHECK (public.is_academy_owner(auth.uid(), academy_id));
CREATE POLICY "Owners can remove members" ON public.academy_members FOR DELETE USING (public.is_academy_owner(auth.uid(), academy_id));

-- Players
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  sport TEXT NOT NULL,
  position TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view players" ON public.players FOR SELECT USING (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Members can insert players" ON public.players FOR INSERT WITH CHECK (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Members can update players" ON public.players FOR UPDATE USING (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Members can delete players" ON public.players FOR DELETE USING (public.is_academy_member(auth.uid(), academy_id));

-- Reports
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  coach_id UUID NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'monthly',
  period_label TEXT NOT NULL,
  player_name TEXT NOT NULL,
  sport TEXT NOT NULL,
  ratings JSONB DEFAULT '{}',
  report_text TEXT NOT NULL,
  template_id TEXT DEFAULT 'classic-green',
  tone TEXT DEFAULT 'encouraging',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view reports" ON public.reports FOR SELECT USING (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Coaches can insert reports" ON public.reports FOR INSERT WITH CHECK (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Coaches can update reports" ON public.reports FOR UPDATE USING (auth.uid() = coach_id);
CREATE POLICY "Coaches can delete reports" ON public.reports FOR DELETE USING (auth.uid() = coach_id);

-- Shared reports (parent portal - public access via token)
CREATE TABLE public.shared_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  share_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  player_name TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.shared_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view shared reports by token" ON public.shared_reports FOR SELECT USING (true);
CREATE POLICY "Members can create share links" ON public.shared_reports FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.reports r WHERE r.id = report_id AND public.is_academy_member(auth.uid(), r.academy_id))
);

-- Match reports
CREATE TABLE public.match_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL,
  team_name TEXT NOT NULL,
  opponent_name TEXT NOT NULL,
  sport TEXT NOT NULL,
  match_date DATE NOT NULL DEFAULT CURRENT_DATE,
  venue TEXT,
  result TEXT NOT NULL DEFAULT 'draw',
  score_own TEXT,
  score_opponent TEXT,
  formation TEXT,
  possession TEXT,
  key_players TEXT,
  tactical_notes TEXT,
  report_text TEXT NOT NULL,
  template_id TEXT DEFAULT 'classic-green',
  tone TEXT DEFAULT 'direct',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.match_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view match reports" ON public.match_reports FOR SELECT USING (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Coaches can insert match reports" ON public.match_reports FOR INSERT WITH CHECK (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Coaches can update match reports" ON public.match_reports FOR UPDATE USING (auth.uid() = coach_id);

-- Contracts
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  contract_type TEXT NOT NULL, -- player, coach, sponsorship, transfer, loan, trial
  title TEXT NOT NULL,
  party_a TEXT NOT NULL,
  party_b TEXT NOT NULL,
  sport TEXT,
  start_date DATE,
  end_date DATE,
  terms JSONB DEFAULT '{}',
  salary_amount NUMERIC,
  salary_currency TEXT DEFAULT 'USD',
  clauses TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, active, expired, terminated
  contract_text TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view contracts" ON public.contracts FOR SELECT USING (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Members can create contracts" ON public.contracts FOR INSERT WITH CHECK (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Creators can update contracts" ON public.contracts FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Creators can delete contracts" ON public.contracts FOR DELETE USING (auth.uid() = created_by);

-- Injuries
CREATE TABLE public.injuries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  player_name TEXT NOT NULL,
  sport TEXT,
  injury_type TEXT NOT NULL,
  body_part TEXT,
  severity TEXT DEFAULT 'moderate', -- minor, moderate, severe
  injury_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_return DATE,
  actual_return DATE,
  treatment_notes TEXT,
  medical_clearance BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active', -- active, recovering, cleared
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.injuries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view injuries" ON public.injuries FOR SELECT USING (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Members can log injuries" ON public.injuries FOR INSERT WITH CHECK (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Members can update injuries" ON public.injuries FOR UPDATE USING (public.is_academy_member(auth.uid(), academy_id));

-- Training sessions
CREATE TABLE public.training_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  sport TEXT NOT NULL,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INTEGER DEFAULT 60,
  title TEXT NOT NULL,
  objectives TEXT,
  drills JSONB DEFAULT '[]',
  attendance JSONB DEFAULT '[]',
  notes TEXT,
  coach_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view sessions" ON public.training_sessions FOR SELECT USING (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Coaches can create sessions" ON public.training_sessions FOR INSERT WITH CHECK (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Coaches can update sessions" ON public.training_sessions FOR UPDATE USING (auth.uid() = coach_id);

-- Tournaments
CREATE TABLE public.tournaments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  format TEXT, -- league, knockout, group+knockout, round-robin
  status TEXT NOT NULL DEFAULT 'upcoming', -- upcoming, ongoing, completed
  teams JSONB DEFAULT '[]',
  standings JSONB DEFAULT '[]',
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view tournaments" ON public.tournaments FOR SELECT USING (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Members can create tournaments" ON public.tournaments FOR INSERT WITH CHECK (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Members can update tournaments" ON public.tournaments FOR UPDATE USING (public.is_academy_member(auth.uid(), academy_id));

-- Finances
CREATE TABLE public.finances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- income, expense
  category TEXT NOT NULL, -- fee, salary, equipment, sponsorship, facility, other
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'completed', -- pending, completed, cancelled
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.finances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view finances" ON public.finances FOR SELECT USING (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Members can add finances" ON public.finances FOR INSERT WITH CHECK (public.is_academy_member(auth.uid(), academy_id));
CREATE POLICY "Members can update finances" ON public.finances FOR UPDATE USING (public.is_academy_member(auth.uid(), academy_id));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_academies_updated_at BEFORE UPDATE ON public.academies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_injuries_updated_at BEFORE UPDATE ON public.injuries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
