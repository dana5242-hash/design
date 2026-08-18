import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Card>
      <EmptyState
        icon={<Compass size={36} />}
        title="페이지를 찾을 수 없습니다"
        description="요청하신 페이지가 존재하지 않거나 이동되었습니다."
        action={
          <Button size="sm" onClick={() => navigate("/")}>
            Dashboard로 이동
          </Button>
        }
      />
    </Card>
  );
}
