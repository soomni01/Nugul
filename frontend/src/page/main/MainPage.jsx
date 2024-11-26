import { Button } from "../../components/ui/button.jsx";
import { toaster } from "../../components/ui/toaster.jsx";

export function MainPage() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        toaster.create({
          description: "File saved successfully",
          type: "info",
        })
      }
    >
      Show Toast
    </Button>
  );
}
