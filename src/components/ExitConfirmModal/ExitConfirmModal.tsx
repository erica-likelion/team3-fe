import s from "./ExitConfirmModal.module.scss";

// 두 방식 모두 지원: 한 줄(message) 또는 줄 배열(messageLines)
type Props = {
  onStay: () => void;
  onLeave: () => void;
  message?: string; // 한 줄 텍스트(원하면 \n 로 줄바꿈)
  messageLines?: string[]; // 여러 줄
};

export default function ExitConfirmModal({
  onStay,
  onLeave,
  message,
  messageLines,
}: Props) {
  const defaultLines = [
    "창업 조건 입력을 중단하고",
    "홈 화면으로 이동하시겠어요?",
  ];

  // 우선순위: messageLines -> message -> 기본
  const lines =
    (messageLines?.length ? messageLines : undefined) ??
    (message ? message.split("\n") : defaultLines);

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
          {lines.map((line, i) => (
            <span key={i}>
              {line}
              {i !== lines.length - 1 && <br />}
            </span>
          ))}
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
