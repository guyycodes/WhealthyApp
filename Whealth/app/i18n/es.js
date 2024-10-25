const es = {
    common: {
      ok: "¡OK!",
      cancel: "Cancelar",
      back: "Atrás",
      skip: "Omitir",
      getStarted: "Comenzar",
      important: "Importante: ",
      notifications: "Notificaciones: ",
      discounts: "Descuentos: "
    },
    walkthrough: {
      slides: {
        slide1: {
          title: "Bienvenido",
          description: "¡Empieza hoy tu viaje hacia una mejor salud y bienestar!"
        },
        slide2: {
          title: "Características",
          description: "¡Explora consejos personalizados de bienestar y planes de fitness para alcanzar tus objetivos!"
        },
        slide3: {
          title: "Comenzar",
          description: "Comienza tu transformación ahora. Tu viaje hacia la salud te espera."
        }
      }
    },
    allowNotifications: {
      title: "¡Notificaciones que apreciarás!",
      description: "Solo te enviaremos notificaciones que realmente apreciarás.",
      updates: "Actualizaciones",
      notifications: "Cuando recibas un mensaje",
      softwareUpdates: "Actualizaciones de software",
      discounts: "Descuentos e información útil",
      continue: "Continuar"
    },
    errorScreen: {
      title: "¡Algo salió mal!",
      friendlySubtitle:
        "Esta es la pantalla que tus usuarios verán en producción cuando se produzca un error. Querrás personalizar este mensaje (ubicado en `app/i18n/es.ts`) y probablemente también el diseño (`app/screens/ErrorScreen`). Si quieres eliminar esto por completo, revisa `app/app.tsx` para el componente <ErrorBoundary>.",
      reset: "REINICIAR APLICACIÓN",
    },
    emptyStateComponent: {
      generic: {
        heading: "Tan vacío... tan triste",
        content: "Aún no se han encontrado datos. Intenta hacer clic en el botón para actualizar o recargar la aplicación.",
        button: "Intentémoslo de nuevo",
      },
    },
    Navigator: {
      homeTab: "Inicio",
      favorites: "Favoritos",
      drive: "Conducir",
      inbox: "Bandeja de entrada",
      more: "Más",
    },
  };
  
  export default es;