import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Unhandled application error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-svh flex items-center justify-center px-4 bg-canvas">
          <div className="max-w-sm w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={22} />
            </div>
            <h2 className="text-base font-semibold text-gray-900">문제가 발생했습니다</h2>
            <p className="text-sm text-gray-500 mt-2">
              예기치 못한 오류로 화면을 표시할 수 없습니다. 입력하신 내용은 자동 저장되어 있으니 안심하고 새로고침해
              주세요.
            </p>
            <Button className="mt-4 w-full" onClick={() => window.location.assign("/")}>
              처음으로 돌아가기
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
