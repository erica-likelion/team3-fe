// src/pages/Community/CommunityPostPage.tsx
import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import s from "./CommunityPostPage.module.scss";

import ChevronDown from "../../assets/ui/chevron-down 2.svg";
import folder from "../../assets/ui/folder.svg";
import xCircle from "../../assets/ui/x-circle.svg";
import plus from "../../assets/ui/plus.svg";
import CategorySheet from "../../components/BottomSheet/CategorySheet";
import { fileToDataURL } from "../../utils/fileToDataURL";
import { submitPost, mapCategoryToEnglish } from "../../services/api";

type Board = "자유게시판" | "제휴게시판";

export default function CommunityPostPage() {
  const nav = useNavigate();

  const [ddOpen, setDdOpen] = useState(false);
  const [board, setBoard] = useState<Board | null>(null);
  const ddWrapRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const isPartner = board === "제휴게시판";

  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImages] = useState<string[]>([]); // ✅ dataURL 문자열 보관
  const [imageFiles, setImageFiles] = useState<File[]>([]); // 실제 파일 객체 보관

  const [myCategory, setMyCategory] = useState<string | null>(null);
  const [partnerCategory, setPartnerCategory] = useState<string | null>(null);
  const [openMyCat, setOpenMyCat] = useState(false);
  const [openPartnerCat, setOpenPartnerCat] = useState(false);

  // ✅ 체크 아이콘 → 저장 → 디테일로 이동
  useEffect(() => {
    const submit = async () => {
      if (!board) return alert("게시판을 선택해 주세요.");
      if (!title.trim()) return alert("제목을 입력해 주세요.");

      try {
        // API 데이터 준비
        const postData = {
          title: title.trim(),
          content: body.trim(),
          category:
            board === "자유게시판"
              ? "GENERAL"
              : ("PARTNERSHIP" as "GENERAL" | "PARTNERSHIP"),
          ...(board === "제휴게시판" &&
            myCategory && {
              myStoreCategory: mapCategoryToEnglish(myCategory),
            }),
          ...(board === "제휴게시판" &&
            partnerCategory && {
              partnerStoreCategory: mapCategoryToEnglish(partnerCategory),
            }),
        };

        // 디버깅: 전송할 데이터 로그
        console.log("전송할 데이터:", postData);
        console.log("이미지 파일 개수:", imageFiles.length);
        console.log("내 업종:", myCategory);
        console.log("제휴할 업종:", partnerCategory);
        console.log(
          "매핑된 내 업종:",
          myCategory ? mapCategoryToEnglish(myCategory) : "없음"
        );
        console.log(
          "매핑된 제휴할 업종:",
          partnerCategory ? mapCategoryToEnglish(partnerCategory) : "없음"
        );

        // API 호출
        const response = await submitPost(
          postData,
          imageFiles.length > 0 ? imageFiles : undefined
        );

        console.log("게시글 작성 성공:", response);

        // 성공 시 커뮤니티 목록으로 이동
        nav("/community");
      } catch (error) {
        console.error("게시글 작성 실패:", error);
        alert("게시글 작성에 실패했습니다. 다시 시도해 주세요.");
      }
    };
    window.addEventListener("community:submitPost", submit as EventListener);
    return () =>
      window.removeEventListener(
        "community:submitPost",
        submit as EventListener
      );
  }, [board, title, body, image, imageFiles, myCategory, partnerCategory, nav]);

  useEffect(() => {
    if (!ddOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!ddWrapRef.current) return;
      if (!ddWrapRef.current.contains(e.target as Node)) setDdOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [ddOpen]);

  const headColorClass = useMemo(() => {
    if (board === "제휴게시판") return s.orText;
    if (board === "자유게시판") return s.blText;
    return s.placeholder;
  }, [board]);

  const chevTone = useMemo(() => {
    if (board === "제휴게시판") return s.chevOR;
    if (board === "자유게시판") return s.chevBL;
    return s.chevGray;
  }, [board]);

  // ✅ 파일 선택 → Data URL로 변환해서 state에 저장 (새로고침/이동 후에도 유지)
  const onPickFiles = async (files: FileList | null) => {
    const arr = Array.from(files ?? []);
    if (!arr.length) return;

    try {
      const dataUrls = await Promise.all(arr.map((f) => fileToDataURL(f)));
      setImages((prev) => [...prev, ...dataUrls]);
      setImageFiles((prev) => [...prev, ...arr]); // 실제 파일 객체도 저장
    } finally {
      // 같은 파일을 연속 선택해도 onChange가 다시 트리거되도록 초기화
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className={s.wrap}>
      <div className={s.topSpacer} aria-hidden />

      <div
        className={`${s.dropdownWrap} ${ddOpen ? "open" : ""}`}
        ref={ddWrapRef}
      >
        <button
          type="button"
          className={`${s.dropdown} ${
            board === "제휴게시판"
              ? s.orBorder
              : board === "자유게시판"
              ? s.blBorder
              : ""
          }`}
          onClick={() => setDdOpen((v) => !v)}
          aria-expanded={ddOpen}
        >
          <span className={`${s.boardText} ${headColorClass}`}>
            {board ?? "게시판을 선택해 주세요"}
          </span>
          <img src={ChevronDown} alt="" className={`${s.chev} ${chevTone}`} />
        </button>

        {ddOpen && (
          <div className={s.ddPanel} role="listbox" aria-label="게시판 선택">
            <button
              className={s.ddItem}
              type="button"
              onClick={() => {
                setBoard("제휴게시판");
                setDdOpen(false);
              }}
            >
              제휴게시판
            </button>
            <button
              className={s.ddItem}
              type="button"
              onClick={() => {
                setBoard("자유게시판");
                setDdOpen(false);
              }}
            >
              자유게시판
            </button>
          </div>
        )}
      </div>

      {isPartner && (
        <div className={s.pairRow}>
          <button
            type="button"
            className={`${s.chip} ${s.chipOutlineOR}`}
            onClick={() => setOpenMyCat(true)}
          >
            {myCategory ?? "내 업종"}
          </button>
          <span className={s.pairText}>에서</span>
          <button
            type="button"
            className={`${s.chip} ${s.chipFillOR}`}
            onClick={() => setOpenPartnerCat(true)}
          >
            {partnerCategory ?? "제휴할 업종"}
          </button>
          <span className={s.pairText}>구하는 글이에요</span>
        </div>
      )}

      <section
        className={`${s.titleBlock} ${isPartner ? s.titleBlockAfterPair : ""}`}
      >
        <input
          className={s.titleInput}
          placeholder="제목을 입력해 주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className={s.divider} aria-hidden />
      </section>

      <section className={s.bodyBox}>
        <textarea
          className={s.bodyArea}
          placeholder="본문을 입력해 주세요"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </section>

      <div className={s.dividerAfterBody} aria-hidden />

      {image.length === 0 ? (
        <div className={s.attachWrap}>
          <button
            type="button"
            className={s.folderBtn}
            onClick={() => fileRef.current?.click()}
            aria-label="파일 첨부"
          >
            <img src={folder} alt="" />
          </button>
        </div>
      ) : (
        <div className={s.thumbRow}>
          {image.map((src, i) => (
            <div className={s.thumb} key={`${src}-${i}`}>
              <img src={src} alt="" />
              <button
                type="button"
                className={s.thumbDel}
                aria-label="삭제"
                onClick={() => {
                  setImages((prev) => prev.filter((_, idx) => idx !== i));
                  setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
                }}
              >
                <img src={xCircle} alt="" />
              </button>
            </div>
          ))}
          <button
            type="button"
            className={s.plusBtn}
            onClick={() => fileRef.current?.click()}
            aria-label="추가"
          >
            <img src={plus} alt="" />
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className={s.hiddenFile}
        multiple
        onChange={(e) => onPickFiles(e.target.files)} // ✅ Data URL 변환 호출
      />

      <CategorySheet
        open={openMyCat}
        title="내 업종을 선택해 주세요"
        initial={myCategory}
        onClose={() => setOpenMyCat(false)}
        onApply={(v) => {
          setMyCategory(v);
          setOpenMyCat(false);
        }}
      />
      <CategorySheet
        open={openPartnerCat}
        title="제휴할 업종을 선택해 주세요"
        initial={partnerCategory}
        onClose={() => setOpenPartnerCat(false)}
        onApply={(v) => {
          setPartnerCategory(v);
          setOpenPartnerCat(false);
        }}
      />
    </div>
  );
}
