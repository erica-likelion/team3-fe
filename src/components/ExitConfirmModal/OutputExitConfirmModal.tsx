// src/components/ExitConfirmModal/OutputExitConfirmModal.tsx

type OutputExitConfirmModalProps = {
  onClose: () => void; // 머무르기
  onConfirm: () => void; // 이동하기
};

export default function OutputExitConfirmModal({
  onClose,
  onConfirm,
}: OutputExitConfirmModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exitTitle"
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "rgba(0,0,0,0.35)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: "min(320px, calc(100vw - 40px))",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          padding: 20,
        }}
      >
        <div
          id="exitTitle"
          style={{
            fontFamily: "Pretendard, system-ui, -apple-system, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            marginBottom: 10,
          }}
        >
          알림
        </div>

        <div
          style={{
            fontFamily: "Pretendard, system-ui, -apple-system, sans-serif",
            fontWeight: 500,
            fontSize: 14,
            lineHeight: 1.4,
            color: "#383326",
            marginBottom: 16,
          }}
        >
          분석 결과 열람을 중단하고
          <br />홈 화면으로 이동하시겠어요?
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onConfirm}
            type="button"
            style={{
              height: 40,
              padding: "0 14px",
              borderRadius: 8,
              fontFamily: "Pretendard, system-ui, -apple-system, sans-serif",
              fontWeight: 700,
              fontSize: 14,
              background: "var(--PRIMARYOR, #f57f4c)",
              color: "#fff",
              border: 0,
              cursor: "pointer",
            }}
          >
            이동하기
          </button>
          <button
            onClick={onClose}
            type="button"
            style={{
              height: 40,
              padding: "0 14px",
              borderRadius: 8,
              fontFamily: "Pretendard, system-ui, -apple-system, sans-serif",
              fontWeight: 700,
              fontSize: 14,
              background: "#fff",
              color: "var(--PRIMARYOR, #f57f4c)",
              border: "1px solid var(--PRIMARYOR, #f57f4c)",
              cursor: "pointer",
            }}
          >
            머무르기
          </button>
        </div>
      </div>
    </div>
  );
}
