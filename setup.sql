-- =============================================
-- RITIFULL — Supabase Database Setup
-- Execute no SQL Editor do Supabase
-- =============================================

-- Tabela de Sites
CREATE TABLE IF NOT EXISTS public.sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'outros'
    CHECK (category IN ('filmes', 'otaku', 'ia', 'outros')),
  thumbnail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Política: permitir leitura pública
CREATE POLICY "Allow public read" ON public.sites
  FOR SELECT USING (true);

-- Política: permitir escrita anon (admin via frontend)
CREATE POLICY "Allow anon write" ON public.sites
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sites_updated_at
  BEFORE UPDATE ON public.sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Dados de exemplo
INSERT INTO public.sites (name, description, url, category, thumbnail) VALUES
('Netflix', 'Plataforma líder em streaming com filmes, séries e conteúdo original exclusivo.', 'https://netflix.com', 'filmes', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png'),
('Prime Video', 'Amazon Prime Video — filmes, séries e Amazon Originals.', 'https://primevideo.com', 'filmes', ''),
('Disney+', 'Streaming oficial da Disney com Marvel, Star Wars, Pixar e National Geographic.', 'https://disneyplus.com', 'filmes', ''),
('Crunchyroll', 'Plataforma líder em streaming de anime e mangá. A maior biblioteca de anime do mundo.', 'https://crunchyroll.com', 'otaku', ''),
('MyAnimeList', 'Base de dados e comunidade para fãs de anime e mangá. Avalie e descubra novos animes.', 'https://myanimelist.net', 'otaku', ''),
('Funimation', 'Streaming de anime dublado em português e legendado. Títulos exclusivos.', 'https://funimation.com', 'otaku', ''),
('ChatGPT', 'IA conversacional da OpenAI. Responde perguntas, gera texto e auxilia em tarefas.', 'https://chat.openai.com', 'ia', ''),
('Google Gemini', 'IA multimodal do Google com capacidades avançadas de raciocínio e geração.', 'https://gemini.google.com', 'ia', ''),
('Claude AI', 'Assistente IA da Anthropic. Focado em raciocínio, segurança e conversas longas.', 'https://claude.ai', 'ia', '');

-- Verificar dados
SELECT id, name, category, created_at FROM public.sites ORDER BY category, name;
