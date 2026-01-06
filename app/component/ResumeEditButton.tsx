// "use client";

// import { useState } from "react";
// import ResumeEditor from "./ResumeEditor";
// import { Button } from "./ui/button";
// import type { Resume, ResumeFormData } from "../types/resume";
// import { useToast } from "./ui/use-toast";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../store/store";
// import { updateResume } from "../store/redux/resumeSlice";

// interface Props {
//   resume: Resume;
// }

// export default function ResumeEditButton({ resume }: Props) {
//   const [isEditing, setIsEditing] = useState(false);
//   const { success, error, info } = useToast();
//   const dispatch = useDispatch<AppDispatch>();

//   // Toggle editor visibility
//   const toggleEditor = () => {
//     setIsEditing(!isEditing);
//     info({
//       title: isEditing ? "Editor closed" : "Editor opened",
//       description: isEditing ? undefined : "You can now edit your resume",
//     });
//   };

//   // Save handler: converts ResumeFormData → full Resume
//   const handleSave = async (updatedData: ResumeFormData) => {
//     try {
//       // Build full Resume object
//       const fullResume: Resume = {
//         ...resume, // keep existing fields like id, createdAt, etc.
//         data: updatedData,
//         title: updatedData.name || "Untitled Resume",
//         updatedAt: new Date().toISOString(),
//       };

//       // Save to backend
//       const response = await fetch(
//         `http://localhost:3000/resumes/${resume.id}`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ data: fullResume }),
//         }
//       );

//       if (!response.ok) throw new Error("Failed to save resume");

//       const savedResume: Resume = await response.json();

//       // Update Redux store
//       dispatch(updateResume(savedResume));

//       success({
//         title: "Resume saved",
//         description: "Your changes have been saved!",
//       });

//       // Close editor after save (optional)
//       setIsEditing(false);
//     } catch (err) {
//       console.error(err);
//       error({
//         title: "Save failed",
//         description: "Could not save your resume.",
//       });
//     }
//   };

//   return (
//     <div>
//       <Button
//         variant="secondary"
//         size="lg"
//         onClick={toggleEditor}
//         className="mb-4"
//       >
//         {isEditing ? "Close Editor" : "Edit Resume"}
//       </Button>

//       {isEditing && (
//         <div className="mt-4">
//           <ResumeEditor
//             resume={resume}
//             onSave={handleSave} // Pass the corrected handler
//           />
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import ResumeEditor from "./ResumeEditor";
import { Button } from "./ui/button";
import type { Resume, ResumeFormData } from "../types/resume";
import { useToast } from "./ui/use-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { updateResume } from "../store/redux/resumeSlice";

interface Props {
  resume: Resume;
}

export default function ResumeEditButton({ resume }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const { success, error, info } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  // Toggle editor open/close
  const toggleEditor = () => {
    setIsEditing(!isEditing);
    info({
      title: isEditing ? "Editor closed" : "Editor opened",
      description: isEditing
        ? undefined
        : "You can now edit your resume in real-time",
    });
  };

  // Handle save: convert ResumeFormData → full Resume and save
  const handleSave = async (updatedData: ResumeFormData) => {
    try {
      const fullResume: Resume = {
        ...resume,
        data: updatedData,
        title: updatedData.name || "Untitled Resume",
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(
        `http://localhost:3000/resumes/${resume.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: fullResume }),
        }
      );

      if (!response.ok) throw new Error("Failed to save resume");

      const savedResume: Resume = await response.json();

      // Update Redux store
      dispatch(updateResume(savedResume));

      success({
        title: "Resume saved",
        description: "Your changes have been successfully saved!",
      });

      // Close editor after save
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      error({
        title: "Save failed",
        description: "There was an error saving your resume.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toggle editor button */}
      <Button
        onClick={toggleEditor}
        variant="secondary"
        size="lg"
        className="w-full md:w-auto"
      >
        {isEditing ? "Close Editor" : "Edit Resume"}
      </Button>

      {/* Editor panel */}
      {isEditing && (
        <div className="mt-4 w-full border rounded-xl shadow-lg overflow-hidden">
          <ResumeEditor resume={resume} onSave={handleSave} />
        </div>
      )}
    </div>
  );
}
