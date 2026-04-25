"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { loadFile, saveFile, deleteFile } from "../helper/indexedDb.js";
import type { FormValues, ValidateResult } from "../types/formConfig.types";

const EXPIRY_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useFormPersistence(
  STORAGE_KEY: string,
  initialState: FormValues,
  initialError: ValidateResult["errors"],
) {
  // --- Stable refs ---
  const initialStateRef = useRef(initialState);
  const initialErrorRef = useRef(initialError);
  const mountedRef = useRef(true);

  // --- State ---
  const [formData, setFormData] = useState<FormValues>(initialStateRef.current);
  const [formError, setFormError] = useState<ValidateResult["errors"]>(
    initialErrorRef.current,
  );
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // --- Optimization refs ---
  const debounceRef = useRef<any>(null);
  const prevSnapshotRef = useRef<string>("");
  const lastFilesSignatureRef = useRef<string>("");

  // --- Helpers ---
  const isFileLike = useCallback((v: unknown): v is File | Blob => {
    return v instanceof File || v instanceof Blob;
  }, []);

  const isFileArray = useCallback(
    (v: unknown): v is (File | Blob)[] =>
      Array.isArray(v) && v.every(isFileLike),
    [isFileLike],
  );

  // --- Save files (optimized) ---
  const saveFilesFromFormData = useCallback(
    async (data: FormValues): Promise<Record<string, string | string[]>> => {
      const filesManifest: Record<string, string | string[]> = {};
      const promises: Promise<boolean>[] = [];

      Object.entries(data).forEach(([key, value]) => {
        if (isFileLike(value)) {
          const fileKey = `${STORAGE_KEY}::${key}`;
          filesManifest[key] = fileKey;
          promises.push(saveFile(fileKey, value));
        } else if (isFileArray(value)) {
          const keys = value.map((_, i) => `${STORAGE_KEY}::${key}_${i}`);
          filesManifest[key] = keys;
          value.forEach((f, i) => promises.push(saveFile(keys[i], f)));
        }
      });

      await Promise.all(promises);
      return filesManifest;
    },
    [STORAGE_KEY, isFileLike, isFileArray],
  );

  const loadFilesFromManifest = useCallback(
    async (manifest: Record<string, string | string[]> = {}) => {
      const entries = await Promise.all(
        Object.entries(manifest).map(async ([fieldKey, manifestValue]) => {
          if (Array.isArray(manifestValue)) {
            const files = await Promise.all(manifestValue.map(loadFile));
            return [fieldKey, files.filter(Boolean)];
          } else {
            const file = await loadFile(manifestValue);
            return [fieldKey, file || null];
          }
        }),
      );
      return Object.fromEntries(entries) as FormValues;
    },
    [],
  );

  const cleanupFiles = useCallback(
    async (filesManifest?: Record<string, string | string[]>) => {
      if (!filesManifest) return;

      for (const value of Object.values(filesManifest)) {
        if (Array.isArray(value)) {
          for (const key of value) await deleteFile(key);
        } else {
          await deleteFile(value);
        }
      }
    },
    [],
  );

  // --- Clear persistence ---
  const clearFormPersistence = useCallback(async () => {
    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY);
      if (savedRaw) {
        const saved = JSON.parse(savedRaw);
        await cleanupFiles(saved.files);
      }
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Error clearing form persistence:", err);
    } finally {
      setFormData(initialStateRef.current);
      setFormError(initialErrorRef.current);
      setCurrentStep(0);
    }
  }, [STORAGE_KEY, cleanupFiles]);

  // --- Load persisted data ---
  useEffect(() => {
    const loadAll = async () => {
      try {
        const savedRaw = localStorage.getItem(STORAGE_KEY);
        if (!savedRaw) return;

        const saved = JSON.parse(savedRaw);
        const { savedAt } = saved;

        if (Date.now() - savedAt > EXPIRY_DURATION) {
          await cleanupFiles(saved.files);
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        let loadedFiles: FormValues = {};
        if (saved.files) {
          loadedFiles = await loadFilesFromManifest(saved.files);
        }

        setFormData({
          ...initialStateRef.current,
          ...(saved.formData || {}),
          ...loadedFiles,
        });

        setFormError(saved.formError || initialErrorRef.current);
        setCurrentStep(saved.currentStep || 0);
      } catch (e) {
        console.warn("Failed to load persisted form data:", e);
        setFormData(initialStateRef.current);
        setFormError(initialErrorRef.current);
      } finally {
        if (mountedRef.current) {
          setIsInitialized(true);
        }
      }
    };

    loadAll();

    return () => {
      mountedRef.current = false;
    };
  }, [STORAGE_KEY, loadFilesFromManifest, cleanupFiles]);

  // --- Persist updates (debounced + optimized) ---
  useEffect(() => {

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      let cancelled = false;

      const persist = async () => {
        // --- Diff check ---
        const snapshot = JSON.stringify({
          formData,
          formError,
          currentStep,
        });

        if (prevSnapshotRef.current === snapshot) return;
        prevSnapshotRef.current = snapshot;

        // --- Prepare data ---
        const formDataSnapshot: FormValues = {};
        Object.entries(formData).forEach(([k, v]) => {
          formDataSnapshot[k] = isFileLike(v) || isFileArray(v) ? null : v;
        });

        // --- File optimization ---
        const fileSignature = JSON.stringify(
          Object.entries(formData).filter(
            ([_, v]) => isFileLike(v) || isFileArray(v),
          ),
        );

        let manifest: Record<string, string | string[]> = {};

        if (fileSignature !== lastFilesSignatureRef.current) {
          lastFilesSignatureRef.current = fileSignature;
          manifest = await saveFilesFromFormData(formData);
        }

        if (cancelled) return;

        const storageData = {
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
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [
    formData,
    formError,
    currentStep,
    isInitialized,
    saveFilesFromFormData,
    isFileLike,
    isFileArray,
  ]);

  // --- API ---
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
