import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Prijava — Admin",
};

export default function PrijavaPage() {
  return (
    <div className="min-h-screen bg-pgd-gray flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-pgd-red rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            PGD
          </div>
          <h1 className="text-2xl font-bold text-white">Prijava v admin</h1>
          <p className="text-gray-400 text-sm mt-1">PGD Nova vas pri Markovcih</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
