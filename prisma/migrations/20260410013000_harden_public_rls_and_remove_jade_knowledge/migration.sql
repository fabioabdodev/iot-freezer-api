-- Hardening for Supabase/PostgREST exposure:
-- 1. remove legacy jade knowledge vector-store artifacts no longer used
-- 2. enable RLS on public tables and revoke anon/authenticated access
-- 3. pin function search_path for trigger helper

-- Remove legacy Jade knowledge objects if they still exist.
DROP TRIGGER IF EXISTS jade_knowledge_documents_set_updated_at
ON public.jade_knowledge_documents;

DROP FUNCTION IF EXISTS public.set_jade_knowledge_documents_updated_at();
DROP FUNCTION IF EXISTS public.match_jade_knowledge_documents(extensions.vector, integer, jsonb);
DROP TABLE IF EXISTS public.jade_knowledge_documents;
DROP TABLE IF EXISTS public.jade_knowledge_registry;

-- Harden helper function flagged by Supabase linter.
ALTER FUNCTION public.set_updated_at()
SET search_path = public;

DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'TemperatureLog',
    'SensorReading',
    'Device',
    'Client',
    'AlertRule',
    'AlertRuleState',
    'Actuator',
    'ActuationCommand',
    'ActuationSchedule',
    'User',
    'PasswordResetToken',
    'ClientModule',
    'ModuleCatalog',
    'ModuleCatalogItem',
    'ClientModuleItem',
    'AuditLog',
    'jade_contacts',
    'jade_conversations',
    'jade_messages',
    'jade_follow_up_queue',
    'jade_human_handoff',
    'n8n_chat_histories'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    IF to_regclass(format('public.%I', tbl)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', tbl);
    END IF;
  END LOOP;
END $$;
