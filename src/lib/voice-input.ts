import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRec = {
  new (): {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
    onresult: ((e: {
      resultIndex: number;
      results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }>> & {
        [key: number]: { isFinal: boolean } & ArrayLike<{ transcript: string }>;
      };
    }) => void) | null;
    onerror: ((e: unknown) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
    abort: () => void;
  };
};

function getRecognitionCtor(): SpeechRec | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: SpeechRec; webkitSpeechRecognition?: SpeechRec };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useVoiceInput(onTranscript: (text: string, isFinal: boolean) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const cbRef = useRef(onTranscript);
  cbRef.current = onTranscript;

  useEffect(() => {
    setSupported(!!getRecognitionCtor());
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    try {
      const rec = new Ctor();
      rec.lang = "en-US";
      rec.interimResults = true;
      rec.continuous = false;
      rec.onresult = (e) => {
        let interim = "";
        let finalText = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i] as { isFinal: boolean } & ArrayLike<{ transcript: string }>;
          const chunk = res[0]?.transcript ?? "";
          if (res.isFinal) finalText += chunk;
          else interim += chunk;
        }
        if (finalText) cbRef.current(finalText.trim(), true);
        else if (interim) cbRef.current(interim.trim(), false);
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      recRef.current = rec as unknown as { stop: () => void };
      rec.start();
      setListening(true);
    } catch (e) {
      console.error("voice start failed", e);
      setListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop?.();
    } catch (e) {
      console.error(e);
    }
    setListening(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { listening, supported, start, stop };
}
