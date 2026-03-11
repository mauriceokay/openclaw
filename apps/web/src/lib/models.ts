export type Provider = "anthropic" | "openai" | "google";

export interface ModelDef {
  id: string;
  name: string;
  provider: Provider;
  inputPricePerM: number;   // USD per 1 M input tokens
  outputPricePerM: number;  // USD per 1 M output tokens
}

// All supported models. Claude models are "included" for paid subscribers;
// non-Claude platform-key usage is billed at MARKUP × provider cost.
export const MODELS: ModelDef[] = [
  // Anthropic
  { id: "claude-sonnet-4-6",        name: "Claude Sonnet 4.6",  provider: "anthropic", inputPricePerM: 3,    outputPricePerM: 15   },
  { id: "claude-opus-4-6",          name: "Claude Opus 4.6",    provider: "anthropic", inputPricePerM: 15,   outputPricePerM: 75   },
  { id: "claude-haiku-4-5-20251001",name: "Claude Haiku 4.5",   provider: "anthropic", inputPricePerM: 0.8,  outputPricePerM: 4    },
  // OpenAI
  { id: "gpt-4o",                   name: "GPT-4o",             provider: "openai",    inputPricePerM: 2.5,  outputPricePerM: 10   },
  { id: "gpt-4o-mini",              name: "GPT-4o Mini",        provider: "openai",    inputPricePerM: 0.15, outputPricePerM: 0.6  },
  // Google
  { id: "gemini-2.0-flash",         name: "Gemini 2.0 Flash",   provider: "google",    inputPricePerM: 0.1,  outputPricePerM: 0.4  },
  { id: "gemini-1.5-pro",           name: "Gemini 1.5 Pro",     provider: "google",    inputPricePerM: 1.25, outputPricePerM: 5    },
];

export const DEFAULT_MODEL_ID = "claude-sonnet-4-6";

export function getModel(id: string | null | undefined): ModelDef {
  return MODELS.find((m) => m.id === id) ?? MODELS.find((m) => m.id === DEFAULT_MODEL_ID)!;
}

// Models grouped by provider for UI rendering
export const MODELS_BY_PROVIDER = MODELS.reduce<Record<Provider, ModelDef[]>>(
  (acc, m) => { acc[m.provider].push(m); return acc; },
  { anthropic: [], openai: [], google: [] },
);

export const PROVIDER_LABELS: Record<Provider, string> = {
  anthropic: "Anthropic",
  openai: "OpenAI",
  google: "Google",
};

export const PROVIDER_KEY_PREFIXES: Record<Provider, string> = {
  anthropic: "sk-ant-",
  openai: "sk-",
  google: "AIza",
};
