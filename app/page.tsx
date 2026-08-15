import { LandingHeader } from "@/components/landing/header";
import { LandingHero } from "@/components/landing/hero";
import { LandingTrustStrip } from "@/components/landing/trust-strip";
import { LandingProblemSolution } from "@/components/landing/problem-solution";
import { LandingFeatures } from "@/components/landing/features";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingAnalyticsSpotlight } from "@/components/landing/analytics-spotlight";
import { LandingTestimonials } from "@/components/landing/testimonials";
import { LandingPricing } from "@/components/landing/pricing";
import { LandingFinalCTA } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingTrustStrip />
        <LandingProblemSolution />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingAnalyticsSpotlight />
        <LandingTestimonials />
        <LandingPricing />
        <LandingFinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
