#!/usr/bin/env node
import path from "path";
import { validateTranslations } from "./validate-translations";

// Default modules path relative to monorepo root
const modulesPath = path.resolve(process.cwd(), "modules");

// Run validation
const valid = validateTranslations(modulesPath);

// Exit with code 1 if validation fails (CI-friendly)
if (!valid) process.exit(1);