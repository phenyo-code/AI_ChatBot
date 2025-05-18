"use client";

import { modelID, MODELS } from "@/ai/providers";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ModelPickerProps {
  selectedModel: modelID;
  setSelectedModel: (model: modelID) => void;
}

export const ModelPicker = ({
  selectedModel,
  setSelectedModel,
}: ModelPickerProps) => {
  return (
    <div className="absolute bottom-2 left-2">
      <Select value={selectedModel} onValueChange={setSelectedModel}>
        <SelectTrigger className="border-blue-200 dark:border-blue-700 bg-white dark:bg-blue-800 text-blue-900 dark:text-blue-100">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-blue-800 border-blue-200 dark:border-blue-700">
          <SelectGroup>
            {MODELS.map((modelId) => (
              <SelectItem
                key={modelId}
                value={modelId}
                className="text-blue-900 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-700"
              >
                {modelId}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};