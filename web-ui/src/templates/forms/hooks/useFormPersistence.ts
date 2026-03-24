import { useEffect, useRef, useState, useCallback } from "react";
import { loadFile, saveFile, deleteFile } from "../helper/indexedDb";

const EXPIRY_DURATION = 24 * 60 * 60 * 1000; // 24 hours

type FileLike = File | Blob;
type FileArray = FileLike[];

type FilesManifest = Record<string, string | string[]>;

interface PersistedData<T, E> {
  formData: Partial<T>;
  formError: E;
  currentStep: number;
  files?: FilesManifest;
  savedAt: number;
}

export function useFormPersistence<T extends Record<string, any>, E>(
  STORAGE_KEY: string,
  initialState: T,
  initialError: E,
) {
  const [formData, setFormData] = useState<T>(initialState);
  const [formError, setFormError] = useState<E>(initialError);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const isLoadingRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);

  // --- Helpers ---
  const isFileLike = (v: unknown): v is FileLike =>
    v instanceof File || v instanceof Blob;

  const isFileArray = (v: unknown): v is FileArray =>
    Array.isArray(v) && v.every((it) => isFileLike(it));

  const saveFilesFromFormData = useCallback(
    async (data: T): Promise<FilesManifest> => {
      const filesManifest: FilesManifest = {};
      const promises: Promise<void>[] = [];

      Object.entries(data).forEach(([key, value]) => {
        if (isFileLike(value)) {
          const fileKey = `${STORAGE_KEY}::${key}`;
          filesManifest[key] = fileKey;
          promises.push(saveFile(fileKey, value));
        } else if (isFileArray(value)) {
          const keys = value.map((_, i) => `${STORAGE_KEY}::${key}_${i}`);
          filesManifest[key] = keys;
          value.forEach((f, i) => {
            promises.push(saveFile(keys[i], f));
          });
        }
      });

      await Promise.all(promises);
      return filesManifest;
    },
    [STORAGE_KEY],
  );

  const loadFilesFromManifest = useCallback(
    async (manifest: FilesManifest = {}): Promise<Partial<T>> => {
      const entries = await Promise.all(
        Object.entries(manifest).map(async ([fieldKey, manifestValue]) => {
          if (Array.isArray(manifestValue)) {
            const files = await Promise.all(
              manifestValue.map((k) => loadFile(k)),
            );
            return [fieldKey, files.filter(Boolean)];
          } else {
            const file = await loadFile(manifestValue);
            return [fieldKey, file ?? null];
          }
        }),
      );

      return Object.fromEntries(entries);
    },
    [],
  );

  const cleanupFiles = useCallback(async (filesManifest?: FilesManifest) => {
    if (!filesManifest) return;

    for (const value of Object.values(filesManifest)) {
      if (Array.isArray(value)) {
        for (const key of value) {
          await deleteFile(key);
        }
      } else {
        await deleteFile(value);
      }
    }
  }, []);

  // --- Manual Clear ---
  const clearFormPersistence = useCallback(async () => {
    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY);
      if (savedRaw) {
        const saved: PersistedData<T, E> = JSON.parse(savedRaw);
        await cleanupFiles(saved.files);
      }

      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    } catch (err) {
      console.error("Error clearing form persistence:", err);
    } finally {
      setFormData(initialState);
      setFormError(initialError);
      setCurrentStep(0);
    }
  }, [STORAGE_KEY, initialState, initialError, cleanupFiles]);

  // --- Load persisted data ---
  useEffect(() => {
    isLoadingRef.current = true;

    const loadAll = async () => {
      try {
        const savedRaw = localStorage.getItem(STORAGE_KEY);
        if (!savedRaw) return;

        const saved: PersistedData<T, E> = JSON.parse(savedRaw);

        if (Date.now() - saved.savedAt > EXPIRY_DURATION) {
          console.info(`[FormPersistence] Data expired for ${STORAGE_KEY}`);
          await cleanupFiles(saved.files);
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        let loadedFiles: Partial<T> = {};
        if (saved.files) {
          loadedFiles = await loadFilesFromManifest(saved.files);
        }

        setFormData({
          ...initialState,
          ...(saved.formData || {}),
          ...loadedFiles,
        });

        setFormError(saved.formError ?? initialError);
        setCurrentStep(saved.currentStep ?? 0);
      } catch (e) {
        console.warn("Failed to load persisted form data:", e);
        setFormData(initialState);
        setFormError(initialError);
      } finally {
        if (mountedRef.current) {
          setIsInitialized(true);
          isLoadingRef.current = false;
        }
      }
    };

    loadAll();

    return () => {
      mountedRef.current = false;
    };
  }, [
    STORAGE_KEY,
    initialState,
    initialError,
    loadFilesFromManifest,
    cleanupFiles,
  ]);

  // --- Persist updates ---
  useEffect(() => {
    if (!isInitialized || isLoadingRef.current) return;

    let cancelled = false;

    const persist = async () => {
      const formDataSnapshot: Partial<T> = {};

      Object.entries(formData).forEach(([k, v]) => {
        (formDataSnapshot as any)[k] =
          isFileLike(v) || isFileArray(v) ? null : v;
      });

      const manifest = await saveFilesFromFormData(formData);
      if (cancelled) return;

      const storageData: PersistedData<T, E> = {
        formData: formDataSnapshot,
        formError,
        currentStep,
        files: manifest,
        savedAt: Date.now(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    };

    persist();

    return () => {
      cancelled = true;
    };
  }, [formData, formError, currentStep, isInitialized, saveFilesFromFormData]);

  return {
    formData,
    setFormData,
    formError,
    setFormError,
    currentStep,
    setCurrentStep,
    isFileLike,
    isFileArray,
    clearFormPersistence,
  };
}
