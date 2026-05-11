import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import TrustBar from '@/components/landing/TrustBar';
import ProblemSection from '@/components/landing/ProblemSection';
import SolutionShowcase from '@/components/landing/SolutionShowcase';
import FeaturesSection from '@/components/landing/FeaturesSection';
import ForWhoSection from '@/components/landing/ForWhoSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import TechSection from '@/components/landing/TechSection';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="w-full flex justify-center bg-[#121413] text-white selection:bg-emerald/30 selection:text-white pb-0 m-0 overflow-x-hidden relative">
      <div className="flex flex-col w-full min-h-screen">
        <Navbar />
        <HeroSection />
        <TrustBar />
        <ProblemSection />
        <SolutionShowcase />
        <FeaturesSection />
        <ForWhoSection />
        <TestimonialsSection />
        <TechSection />
        <CtaSection />
        <Footer />
      </div>
    </main>
  );
}