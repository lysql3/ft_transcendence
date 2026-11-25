import { Card } from "@/components/ui/Card";
import Account from "./Account";
import Style from "./Style";

export default function MenuContent({
  selectedSection,
}: {
  selectedSection: string | null;
}) {
  return (
    <Card variant="flat">
      <section>
        {selectedSection === "Account" && <Account />}
        {selectedSection === "Style" && <Style />}
      </section>
    </Card>
  );
}
