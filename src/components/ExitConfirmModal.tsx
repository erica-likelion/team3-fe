// src/components/ExitConfirmModal.tsx
import s from "./ExitConfirmModal.module.scss";

export default function ExitConfirmModal({
  onStay,
  onLeave,
}: {
  onStay: () => void;
  onLeave: () => void;
}) {
  return (
    <>
      <div className={s.overlay} />
      <div
        className={s.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exitTitle"
      >
        <div id="exitTitle" className={s.title}>
          알림
        </div>
        <div className={s.text}>
          창업 조건 입력을 중단하고
          <br />홈 화면으로 이동하시겠어요?
        </div>
        <div className={s.actions}>
          <button
            className={`${s.btn} ${s.outline}`}
            onClick={onLeave}
            type="button"
          >
            이동하기
          </button>
          <button
            className={`${s.btn} ${s.primary}`}
            onClick={onStay}
            type="button"
          >
            머무르기
          </button>
        </div>
      </div>
    </>
  );
}
