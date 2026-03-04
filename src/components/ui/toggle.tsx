"use client";

import { Field, Label, Switch } from "@headlessui/react";
import { cn } from "@/lib/utils/cn";

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
}

export default function Toggle({ enabled, onChange, label, description }: ToggleProps) {
  return (
    <Field>
      <div className="flex items-center justify-between">
        {(label || description) && (
          <div>
            {label && (
              <Label className="text-sm font-medium text-gray-700 cursor-pointer">
                {label}
              </Label>
            )}
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        )}
        <Switch
          checked={enabled}
          onChange={onChange}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
            enabled ? "bg-indigo-600" : "bg-gray-200"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              enabled ? "translate-x-6" : "translate-x-1"
            )}
          />
        </Switch>
      </div>
    </Field>
  );
}
