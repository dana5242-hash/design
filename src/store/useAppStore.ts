import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "../lib/id";
import {
  emptyDesignRequest,
  type AISettings,
  type CompanySettings,
  type Project,
  type ProjectStatus,
  type UserProfile,
} from "../types";

interface AppState {
  user: UserProfile;
  company: CompanySettings;
  aiSettings: AISettings;
  projects: Project[];

  createProject: (projectName: string) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setStatus: (id: string, status: ProjectStatus) => void;
  addRevision: (id: string, changedContent: string) => void;
  getProject: (id: string) => Project | undefined;

  updateUser: (patch: Partial<UserProfile>) => void;
  updateCompany: (patch: Partial<CompanySettings>) => void;
  updateAISettings: (patch: Partial<AISettings>) => void;
}

const defaultUser: UserProfile = {
  userId: generateId("user"),
  name: "홍길동",
  department: "브랜드마케팅팀",
  position: "매니저",
  email: "",
  role: "요청자",
};

const defaultCompany: CompanySettings = {
  companyName: "",
  brandColors: [],
  logoDataUrl: "",
  designGuide: "",
};

const defaultAISettings: AISettings = {
  defaultAnalysisLevel: "normal",
  aiModelLabel: "Design Brief AI Engine v1",
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      company: defaultCompany,
      aiSettings: defaultAISettings,
      projects: [],

      createProject: (projectName: string) => {
        const now = new Date().toISOString();
        const project: Project = {
          id: generateId("proj"),
          projectName: projectName || "제목 없는 프로젝트",
          creatorId: get().user.userId,
          requestDate: now.slice(0, 10),
          deadline: "",
          status: "draft",
          favorite: false,
          currentStep: 1,
          createdAt: now,
          updatedAt: now,
          designRequest: emptyDesignRequest(),
          references: [],
          aiBrief: null,
          revisions: [],
        };
        set((state) => ({ projects: [project, ...state.projects] }));
        return project;
      },

      updateProject: (id, patch) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, ...patch, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
      },

      duplicateProject: (id) => {
        const original = get().projects.find((p) => p.id === id);
        if (!original) return;
        const now = new Date().toISOString();
        const copy: Project = {
          ...original,
          id: generateId("proj"),
          projectName: `${original.projectName} (사본)`,
          status: "draft",
          favorite: false,
          createdAt: now,
          updatedAt: now,
          revisions: [],
        };
        set((state) => ({ projects: [copy, ...state.projects] }));
      },

      toggleFavorite: (id) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, favorite: !p.favorite } : p
          ),
        }));
      },

      setStatus: (id, status) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, status, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      addRevision: (id, changedContent) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== id) return p;
            const nextVersion = p.revisions.length + 1;
            return {
              ...p,
              revisions: [
                ...p.revisions,
                {
                  id: generateId("rev"),
                  version: nextVersion,
                  changedContent,
                  modifiedBy: get().user.name,
                  modifiedAt: new Date().toISOString(),
                },
              ],
            };
          }),
        }));
      },

      getProject: (id) => get().projects.find((p) => p.id === id),

      updateUser: (patch) => set((state) => ({ user: { ...state.user, ...patch } })),
      updateCompany: (patch) =>
        set((state) => ({ company: { ...state.company, ...patch } })),
      updateAISettings: (patch) =>
        set((state) => ({ aiSettings: { ...state.aiSettings, ...patch } })),
    }),
    {
      name: "design-brief-maker-storage",
      version: 1,
    }
  )
);
