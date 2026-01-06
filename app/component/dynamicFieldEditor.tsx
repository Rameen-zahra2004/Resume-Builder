import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import { updateElement, selectElements } from "../store/redux/editorSlice";

interface DynamicFieldEditorProps {
  elementId: string;
}

export default function DynamicFieldEditor({
  elementId,
}: DynamicFieldEditorProps) {
  const dispatch = useAppDispatch();
  const elements = useAppSelector(selectElements);

  // Find the element
  const element = elements.find((e) => e.id === elementId);

  // Lazy initializer for state to avoid useMemo warnings
  const [content, setContent] = useState<string[]>(() => {
    if (!element) return [];

    if (element.options?.length) {
      return element.content
        ? element.content
            .split("\n")
            .slice(1)
            .map((s) => s.replace(/^- /, ""))
        : [];
    }
    return [element.content || ""];
  });

  if (!element) return null;

  // Handle multi-option checkboxes (Skills)
  const handleOptionChange = (option: string, checked: boolean) => {
    const newContent = checked
      ? [...content, option]
      : content.filter((s) => s !== option);

    setContent(newContent);

    dispatch(
      updateElement({
        id: elementId,
        changes: {
          content: "Skills\n- " + newContent.join("\n- "),
        },
      })
    );
  };

  // Handle single-line text fields
  const handleTextChange = (value: string, index: number) => {
    const newContent = [...content];
    newContent[index] = value;
    setContent(newContent);

    dispatch(
      updateElement({
        id: elementId,
        changes: { content: newContent[0] },
      })
    );
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 mb-4">
      <h3 className="font-semibold mb-2">
        {element.options ? "Select Skills" : "Edit Field"}
      </h3>

      {element.options?.length ? (
        <div className="flex flex-wrap gap-2">
          {element.options.map((option: string) => (
            <label
              key={option}
              className="flex items-center space-x-1 bg-white border px-2 py-1 rounded cursor-pointer hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={content.includes(option)}
                onChange={(e) => handleOptionChange(option, e.target.checked)}
                className="w-4 h-4"
                aria-label={option}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {content.map((val, index) => (
            <input
              key={index}
              type="text"
              value={val}
              onChange={(e) => handleTextChange(e.target.value, index)}
              placeholder={element.content || "Enter value"}
              aria-label={`Edit ${element.id}`}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
          ))}
        </div>
      )}
    </div>
  );
}
