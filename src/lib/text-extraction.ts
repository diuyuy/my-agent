/**
 * 파일에서 텍스트를 추출하는 유틸리티
 */

export interface ExtractedTextData {
  content: string;
  resourceName: string;
}

// 상수 관리 (버전 관리가 용이하도록 분리)
const PDFJS_VERSION = "5.4.149";
const PDFJS_CDN_BASE = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`;

/**
 * .txt 파일에서 텍스트를 추출합니다.
 */
export async function extractTextFromTxtFile(
  file: File
): Promise<ExtractedTextData> {
  // MIME 타입이 비어있는 경우도 있으므로 확장자 체크를 우선시하거나 병행합니다.
  if (!file.type.startsWith("text/") && !file.name.endsWith(".txt")) {
    throw new Error("지원하지 않는 파일 형식입니다. .txt 파일만 지원합니다.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        // 빈 파일일 경우 처리
        resolve({ content: "", resourceName: file.name });
        return;
      }
      resolve({
        content: content.trim(),
        resourceName: file.name,
      });
    };

    reader.onerror = () => {
      reject(new Error("파일을 읽는 중 오류가 발생했습니다."));
    };

    // 기본 UTF-8. 필요시 인코딩 감지 로직 추가 가능
    reader.readAsText(file, "UTF-8");
  });
}

/**
 * PDF.js 라이브러리를 동적으로 로드합니다. (ES Module 방식)
 */

type PDFJsLib = typeof import("pdfjs-dist");

async function loadPdfJs(): Promise<PDFJsLib> {
  if (typeof window === "undefined") {
    throw new Error("PDF.js는 브라우저 환경에서만 사용할 수 있습니다.");
  }

  try {
    // 이미 로드된 모듈이 있다면 재사용하거나, import() 캐싱을 이용합니다.
    const pdfjsLib = (await import(
      /* webpackIgnore: true */
      `${PDFJS_CDN_BASE}/pdf.min.mjs`
    )) as PDFJsLib;

    // Worker 설정 (중요: 메인 라이브러리와 버전이 일치해야 함)
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN_BASE}/pdf.worker.min.mjs`;
    }

    return pdfjsLib;
  } catch (error) {
    console.error(error);
    throw new Error("PDF.js 라이브러리를 로드하는 중 오류가 발생했습니다.");
  }
}

/**
 * PDF 파일에서 텍스트를 추출합니다.
 */
export async function extractTextFromPdf(
  file: File
): Promise<ExtractedTextData> {
  if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
    throw new Error("지원하지 않는 파일 형식입니다. .pdf 파일만 지원합니다.");
  }

  try {
    const pdfjsLib = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();

    // PDF 로드
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
    });
    const pdf = await loadingTask.promise;

    // 병렬 처리를 위한 페이지 번호 배열 생성
    const pagePromises = Array.from(
      { length: pdf.numPages },
      (_, i) => i + 1
    ).map(async (pageNum) => {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // 일반적인 텍스트 추출: 아이템을 공백으로 연결
      return textContent.items
        .map((item) => {
          if ("str" in item) {
            return item.str;
          }

          return "";
        })
        .join(" ");
    });

    // 모든 페이지 병렬 처리 대기
    const pageTexts = await Promise.all(pagePromises);
    const content = pageTexts.join("\n\n").trim(); // 페이지 간 구분

    if (!content) {
      // 내용은 없지만 파일은 정상인 경우 에러보다는 빈 문자열 반환이 나을 수 있음 (정책에 따라 결정)
      // 여기서는 기존 로직 유지
      throw new Error("PDF에서 텍스트를 추출할 수 없습니다.");
    }

    return {
      content,
      resourceName: file.name,
    };
  } catch (error) {
    // 에러 전파 시 원본 에러 메시지 보존이 디버깅에 유리함
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("PDF 처리 중 알 수 없는 오류가 발생했습니다.");
  }
}
