const fr = {
  common: {
    ok: "OK !",
    cancel: "Annuler",
    back: "Retour",
    skip: "Passer",
    getStarted: "Commencer",
    important: "Important : ",
    notifications: "Notifications : ",
    discounts: "Réductions : "
  },
  walkthrough: {
    slides: {
      slide1: {
        title: "Bienvenue",
        description: "Commencez dès aujourd'hui votre parcours vers une meilleure santé et bien-être !"
      },
      slide2: {
        title: "Fonctionnalités",
        description: "Explorez des conseils de bien-être personnalisés et des plans de remise en forme pour atteindre vos objectifs !"
      },
      slide3: {
        title: "Commencer",
        description: "Commencez votre transformation maintenant. Votre parcours santé vous attend."
      }
    }
  },
  allowNotifications: {
    title: "Notifications que vous apprécierez !",
    description: "Nous vous enverrons seulement des notifications que vous trouverez utiles.",
    updates: "Mises à jour",
    notifications: "Lorsque vous recevez un message",
    softwareUpdates: "Mises à jour logicielles",
    discounts: "Réductions et informations utiles",
    continue: "Continuer"
  },
  errorScreen: {
    title: "Quelque chose s'est mal passé !",
    friendlySubtitle:
      "C'est l'écran que vos utilisateurs verront en production lorsqu'une erreur sera lancée. Vous voudrez personnaliser ce message (situé dans `app/i18n/fr.ts`) et probablement aussi la mise en page (`app/screens/ErrorScreen`). Si vous voulez le supprimer complètement, vérifiez `app/app.tsx` pour le composant <ErrorBoundary>.",
    reset: "RÉINITIALISER L'APPLICATION",
  },
  emptyStateComponent: {
    generic: {
      heading: "Si vide... si triste",
      content:
        "Aucune donnée trouvée pour le moment. Essayez de cliquer sur le bouton pour rafraîchir ou recharger l'application.",
      button: "Essayons à nouveau",
    },
  },
  Navigator: {
    homeTab: "Accueil",
    favorites: "Marché",
    drive: "Payer",
    inbox: "Portefeuille",
    more: "Profil",
  },
}

export default fr
