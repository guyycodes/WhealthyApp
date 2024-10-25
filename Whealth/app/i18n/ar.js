
// arabic is read rtl....right to left, make sure this works RTL in i18n
const ar = {
  common: {
    ok: "حسنا!",
    cancel: "إلغاء",
    back: "رجوع",
    skip: "تخطي",
    getStarted: "ابدأ",
    important: "مهم: ",
    notifications: "الإشعارات: ",
    discounts: "الخصومات: "
  },
  walkthrough: {
    slides: {
      slide1: {
        title: "مرحبًا",
        description: "ابدأ رحلتك نحو صحة أفضل ورفاهية اليوم!"
      },
      slide2: {
        title: "الميزات",
        description: "استكشف نصائح العافية المخصصة وخطط اللياقة لتحقيق أهدافك!"
      },
      slide3: {
        title: "ابدأ الآن",
        description: "ابدأ تحولك الآن. رحلتك الصحية تنتظرك."
      }
    }
  },
  allowNotifications: {
    title: "إشعارات ستقدرها!",
    description: "سنرسل لك فقط الإشعارات التي ستقدرها.",
    updates: "التحديثات",
    notifications: "عند استلامك رسالة",
    softwareUpdates: "تحديثات البرنامج",
    discounts: "خصومات ومعلومات مفيدة",
    continue: "متابعة"
  },
  errorScreen: {
    title: "هناك خطأ ما",
    friendlySubtitle:
      "هذه هي الشاشة التي سيشاهدها المستخدمون في عملية الانتاج عند حدوث خطأ. سترغب في تخصيص هذه الرسالة ( الموجودة في 'ts.en/i18n/app') وربما التخطيط ايضاً ('app/screens/ErrorScreen'). إذا كنت تريد إزالة هذا بالكامل، تحقق من 'app/app.tsp' من اجل عنصر <ErrorBoundary>.",
    reset: "اعادة تعيين التطبيق",
  },
  emptyStateComponent: {
    generic: {
      heading: "فارغة جداً....حزين",
      content: "لا توجد بيانات حتى الآن. حاول النقر فوق الزر لتحديث التطبيق او اعادة تحميله.",
      button: "لنحاول هذا مرّة أخرى",
    },
  },
  Navigator: {
    homeTab: "الرئيسية",
    favorites: "السوق",
    drive: "الدفع",
    inbox: "المحفظة",
    more: "الملف الشخصي",
  },
}

export default ar
