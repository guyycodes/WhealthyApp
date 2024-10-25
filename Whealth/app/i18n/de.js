const de = {
  common: {
    ok: "OK!",
    cancel: "Abbrechen",
    back: "Zurück",
    skip: "Überspringen",
    getStarted: "Loslegen",
    important: "Wichtig: ",
    notifications: "Benachrichtigungen: ",
    discounts: "Rabatte: "
  },
  walkthrough: {
    slides: {
      slide1: {
        title: "Willkommen",
        description: "Beginnen Sie noch heute Ihre Reise zu besserer Gesundheit und Wohlbefinden!"
      },
      slide2: {
        title: "Funktionen",
        description: "Entdecken Sie personalisierte Wellness-Tipps und Fitnesspläne, um Ihre Ziele zu erreichen!"
      },
      slide3: {
        title: "Loslegen",
        description: "Beginnen Sie jetzt Ihre Transformation. Ihre Gesundheitsreise wartet."
      }
    }
  },
  allowNotifications: {
    title: "Benachrichtigungen, die Sie schätzen werden!",
    description: "Wir werden Ihnen nur Benachrichtigungen senden, die Sie wirklich schätzen.",
    updates: "Updates",
    notifications: "Wenn Sie eine Nachricht erhalten",
    softwareUpdates: "Software-Updates",
    discounts: "Rabatte und nützliche Informationen",
    continue: "Weiter"
  },
  errorScreen: {
    title: "Etwas ist schief gelaufen!",
    friendlySubtitle:
      "Dies ist der Bildschirm, den Ihre Benutzer in der Produktion sehen, wenn ein Fehler auftritt. Sie sollten diese Nachricht anpassen (zu finden in `app/i18n/de.ts`) und wahrscheinlich auch das Layout (`app/screens/ErrorScreen`). Wenn Sie dies vollständig entfernen möchten, überprüfen Sie die Komponente <ErrorBoundary> in `app/app.tsx`.",
    reset: "APP ZURÜCKSETZEN",
  },
  emptyStateComponent: {
    generic: {
      heading: "So leer... so traurig",
      content: "Noch keine Daten gefunden. Versuchen Sie, die App zu aktualisieren oder neu zu laden.",
      button: "Versuchen wir es noch einmal",
    },
  },
  Navigator: {
    homeTab: "Startseite",
    favorites: "Favoriten",
    drive: "Fahren",
    inbox: "Posteingang",
    more: "Mehr",
  },
}

export default de
