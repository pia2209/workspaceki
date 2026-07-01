export function describeAiError(err: unknown): string {
  if (err instanceof Error) {
    if (/api.?key/i.test(err.message)) {
      return "ANTHROPIC_API_KEY ist nicht gesetzt oder ungültig. Siehe README für die Konfiguration.";
    }
    return err.message;
  }
  return "Unbekannter Fehler bei der KI-Anfrage.";
}
