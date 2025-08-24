import s from "./ExitConfirmModal.module.scss";

type Props = {
  onStay: () => void;
  onLeave: () => void;
  messageLines: string[];
  isFranchise?: boolean;
};

export default function CollaborationConfirmModal({
  onStay,
  onLeave,
  messageLines,
  isFranchise = false,
}: Props) {
  return (
    <>
      <div className={s.overlay} onClick={onLeave} />
      <div
        className={s.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exitTitle"
        style={
          isFranchise
            ? {
                width: "335px",
                height: "215px",
                borderRadius: "12px",
                background: "#FFFAFA",
              }
            : {}
        }
      >
        <div id="exitTitle" className={s.title}>
          알림
        </div>

        <div
          className={s.text}
          style={
            isFranchise
              ? {
                  color: "#383325",
                  textAlign: "center",
                  fontSize: "18px",
                  fontWeight: "500",
                  lineHeight: "150%",
                }
              : {}
          }
        >
          {messageLines.map((line, i) => (
            <span key={i}>
              {line}
              {i !== messageLines.length - 1 && <br />}
            </span>
          ))}
        </div>

        <div className={s.actions}>
          {isFranchise ? (
            <button
              className={`${s.btn} ${s.outline}`}
              onClick={onLeave}
              type="button"
              style={{
                margin: "0 auto",
                background: "#f3633f",
                border: "1px solid #f3633f",
                color: "#FFFAFA",
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "700",
                lineHeight: "150%",
                letterSpacing: "-0.485px",
              }}
            >
              이전으로
            </button>
          ) : (
            <>
              <button
                className={`${s.btn} ${s.outline}`}
                onClick={onLeave}
                type="button"
              >
                이전으로
              </button>
              <button
                className={`${s.btn} ${s.primary}`}
                onClick={onStay}
                type="button"
              >
                진행하기
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
