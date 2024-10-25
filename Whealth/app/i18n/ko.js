

const ko = {
  common: {
    ok: "확인!",
    cancel: "취소",
    back: "뒤로",
    skip: "건너뛰기",
    getStarted: "시작하기",
  },
  walkthrough: {
    slides: {
      slide1: {
        title: "환영합니다",
        description: "오늘 더 나은 건강과 웰빙을 위한 여정을 시작하세요!"
      },
      slide2: {
        title: "기능",
        description: "목표를 달성하기 위해 개인 맞춤형 웰빙 팁과 피트니스 계획을 탐색하세요!"
      },
      slide3: {
        title: "시작하기",
        description: "지금 변화를 시작하세요. 건강을 위한 여정이 기다리고 있습니다."
      }
    }
  },
  errorScreen: {
    title: "뭔가 잘못되었습니다!",
    friendlySubtitle:
      "이 화면은 오류가 발생할 때 프로덕션에서 사용자에게 표시됩니다. 이 메시지를 커스터마이징 할 수 있고(해당 파일은 `app/i18n/ko.ts` 에 있습니다) 레이아웃도 마찬가지로 수정할 수 있습니다(`app/screens/error`). 만약 이 오류화면을 완전히 없에버리고 싶다면 `app/app.tsx` 파일에서 <ErrorBoundary> 컴포넌트를 확인하기 바랍니다.",
    reset: "초기화",
  },
  emptyStateComponent: {
    generic: {
      heading: "너무 텅 비어서.. 너무 슬퍼요..",
      content: "데이터가 없습니다. 버튼을 눌러서 리프레쉬 하시거나 앱을 리로드하세요.",
      button: "다시 시도해봅시다",
    },
  },
  Navigator: {
    homeTab: "홈",
    favorites: "마켓플레이스",
    drive: "결제",
    inbox: "지갑",
    more: "프로필",
  },
}

export default ko
