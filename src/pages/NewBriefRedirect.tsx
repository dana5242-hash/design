import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export default function NewBriefRedirect() {
  const createProject = useAppStore((s) => s.createProject);
  const [newId, setNewId] = useState<string | null>(null);
  const createdRef = useRef(false);

  useEffect(() => {
    if (createdRef.current) return;
    createdRef.current = true;
    setNewId(createProject("").id);
  }, [createProject]);

  if (!newId) return null;
  return <Navigate to={`/briefs/${newId}/edit`} replace />;
}
