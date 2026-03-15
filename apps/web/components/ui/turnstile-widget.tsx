'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          theme?: 'light' | 'dark' | 'auto';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: (errorCode?: string) => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

type TurnstileWidgetProps = {
  siteKey: string;
  onTokenChange: (token: string | null) => void;
  resetKey?: number;
};

export function TurnstileWidget({
  siteKey,
  onTokenChange,
  resetKey = 0,
}: TurnstileWidgetProps) {
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const lastResetKeyRef = useRef(resetKey);
  const [scriptReady, setScriptReady] = useState(
    typeof window !== 'undefined' && Boolean(window.turnstile),
  );
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [hasWidgetError, setHasWidgetError] = useState(false);

  useEffect(() => {
    if (
      !scriptReady ||
      !siteKey ||
      !window.turnstile ||
      widgetId ||
      !widgetContainerRef.current
    ) {
      return;
    }

    let renderedWidgetId: string | null = null;

    try {
      renderedWidgetId = window.turnstile.render(widgetContainerRef.current, {
        sitekey: siteKey,
        theme: 'dark',
        callback: (token) => onTokenChange(token),
        'expired-callback': () => onTokenChange(null),
        'error-callback': (errorCode) => {
          console.error('Turnstile widget error:', errorCode ?? 'unknown');
          onTokenChange(null);
        },
      });

      setWidgetId(renderedWidgetId);
      setHasWidgetError(false);
    } catch (error) {
      console.error('Turnstile render failed:', error);
      setHasWidgetError(true);
      onTokenChange(null);
    }

    return () => {
      if (!renderedWidgetId || !window.turnstile) return;

      try {
        window.turnstile.remove(renderedWidgetId);
      } catch {
        // Ignora erros de limpeza para evitar derrubar a pagina.
      }
    };
  }, [onTokenChange, scriptReady, siteKey, widgetId]);

  useEffect(() => {
    if (!widgetId || !window.turnstile) return;
    if (lastResetKeyRef.current === resetKey) return;

    try {
      window.turnstile.reset(widgetId);
      lastResetKeyRef.current = resetKey;
      onTokenChange(null);
    } catch (error) {
      console.error('Turnstile reset failed:', error);
      setHasWidgetError(true);
      onTokenChange(null);
    }
  }, [onTokenChange, resetKey, widgetId]);

  return (
    <div className="space-y-2">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onError={() => {
          console.error('Turnstile script failed to load.');
          setHasWidgetError(true);
          onTokenChange(null);
        }}
      />
      <div
        ref={widgetContainerRef}
        className="min-h-[66px] rounded-2xl border border-line/70 bg-bg/20 p-2"
      />
      <p className="text-xs text-muted">
        Validacao anti-bot do Cloudflare Turnstile.
      </p>
      {hasWidgetError ? (
        <p className="text-xs text-bad">
          Nao foi possivel carregar a validacao anti-bot agora.
        </p>
      ) : null}
    </div>
  );
}
