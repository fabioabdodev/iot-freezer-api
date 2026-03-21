const appVersion = process.env.NEXT_PUBLIC_APP_VERSION ?? 'v1.0.0';
const appRelease = process.env.NEXT_PUBLIC_APP_RELEASE ?? 'local';
const appBuildTime = process.env.NEXT_PUBLIC_APP_BUILD_TIME ?? 'nao informado';
const copyrightYear = new Date().getFullYear();

export function ReleaseFooter() {
  return (
    <footer className="border-t border-line/60 bg-card/40 px-4 py-3 text-xs text-muted sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-ink">
          Virtuagil Monitor {appVersion.startsWith('v') ? appVersion : `v${appVersion}`}
        </p>
        <p>
          Release: <span className="font-medium text-ink">{appRelease}</span> · Build:{' '}
          <span className="font-medium text-ink">{appBuildTime}</span>
        </p>
        <p>© {copyrightYear} Virtuagil. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

