import { notFound } from "next/navigation";
import { getMandate, listItems, listGenerations } from "@/lib/repo";
import { MandateHub } from "@/components/MandateHub";

export const dynamic = "force-dynamic";

export default async function MandatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mandate = getMandate(id);
  if (!mandate) notFound();

  const items = listItems(id);
  const deliverableGenerations = listGenerations(id, "deliverable");
  const qaGenerations = listGenerations(id, "qa");

  return (
    <MandateHub
      mandate={mandate}
      items={items}
      deliverableGenerations={deliverableGenerations}
      qaGenerations={qaGenerations}
    />
  );
}
