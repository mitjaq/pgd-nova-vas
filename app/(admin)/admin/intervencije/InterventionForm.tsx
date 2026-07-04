"use client";

import { useActionState } from "react";
import { createIntervention } from "@/app/_lib/actions/interventions";
import { Card, CardBody } from "@/app/_components/ui/Card";
import Button from "@/app/_components/ui/Button";

const initialState = { error: undefined };

const today = new Date().toISOString().split("T")[0];

export default function InterventionForm() {
  const [state, action, pending] = useActionState(createIntervention, initialState);

  return (
    <Card className="max-w-2xl">
      <CardBody className="p-6">
        <form action={action} className="space-y-5">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Naziv <span className="text-pgd-red">*</span>
            </label>
            <input
              name="title"
              type="text"
              required
              placeholder="Npr. Požar stanovanjske hiše"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Datum <span className="text-pgd-red">*</span>
              </label>
              <input
                name="date"
                type="date"
                required
                defaultValue={today}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vrsta <span className="text-pgd-red">*</span>
              </label>
              <select
                name="type"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red bg-white"
              >
                <option value="">Izberi vrsto...</option>
                <option value="pozar">Požar</option>
                <option value="tehnicna">Tehnična nesreča</option>
                <option value="poplava">Poplava</option>
                <option value="iskanje">Iskalna akcija</option>
                <option value="vaja">Vaja</option>
                <option value="drugo">Drugo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lokacija <span className="text-pgd-red">*</span>
            </label>
            <input
              name="location"
              type="text"
              required
              placeholder="Npr. Nova vas 15, Markovci"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opis
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Kratek opis intervencije..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red resize-none"
            />
          </div>

          <Button type="submit" loading={pending}>
            Shrani intervencijo
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
