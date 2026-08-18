import { HashRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastProvider } from "./components/ui/ToastProvider";
import { AppShell } from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import Briefs from "./pages/Briefs";
import NewBriefRedirect from "./pages/NewBriefRedirect";
import NewBriefWizard from "./pages/NewBriefWizard";
import BriefDetail from "./pages/BriefDetail";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <HashRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/briefs" element={<Briefs />} />
              <Route path="/briefs/new" element={<NewBriefRedirect />} />
              <Route path="/briefs/:id/edit" element={<NewBriefWizard />} />
              <Route path="/briefs/:id" element={<BriefDetail />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
        </HashRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
