import Link from "next/link";
import { Card, CardBody } from "@/app/_components/ui/Card";
import Button from "@/app/_components/ui/Button";
import { createIntervention } from "@/app/_lib/actions/interventions";
import InterventionForm from "../InterventionForm";

export default function NovaIntervencijePage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/intervencije" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Nazaj
        </Link>
        <h1 className="text-2xl font-bold text-pgd-gray">Nova intervencija</h1>
      </div>
      <InterventionForm />
    </div>
  );
}
