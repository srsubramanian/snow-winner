import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import type { ValidationResult } from "@/types/ticket";

interface ValidationChecklistProps {
  results: ValidationResult[];
}

export function ValidationChecklist({ results }: ValidationChecklistProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Validation Checklist</h3>
      <div className="space-y-2">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              result.passed
                ? "bg-green-50 border-green-200"
                : result.severity === "error"
                ? "bg-red-50 border-red-200"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {result.passed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : result.severity === "error" ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.rule}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      result.passed
                        ? "bg-green-100 text-green-700"
                        : result.severity === "error"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {result.passed ? "PASS" : result.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.message}
                </p>
                {!result.passed && result.suggestion && (
                  <div className="mt-2 p-2 bg-white/50 rounded text-sm">
                    <span className="font-medium">How to fix: </span>
                    {result.suggestion}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
