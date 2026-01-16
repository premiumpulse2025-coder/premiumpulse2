import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { PolicyEvolutionEngine } from "@/components/policy-evolution-engine";

export default function PolicyEvolutionPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header />
      
      <main className="pt-[80px]">
        <PolicyEvolutionEngine />
      </main>

      <Footer />
    </div>
  );
}
