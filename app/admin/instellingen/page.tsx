export default function Settings() {
  return (
    <div className="max-w-xl space-y-4">
      <div><p className="eyebrow">Configuratie</p><h1 className="h-section mt-2">Instellingen</h1></div>
      <p className="text-sm text-fg-muted">Bedrijfsgegevens, verzendtarieven, btw en e-mailteksten. Vul de placeholders ({'{{...}}'}) in de codebase en .env.local in.</p>
    </div>
  );
}
