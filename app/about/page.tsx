import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";
import { AboutHero } from "@/components/about/about-hero";
import { AboutStats } from "@/components/about/about-stats";
import { AboutStory } from "@/components/about/about-story";
import { AboutValues } from "@/components/about/about-values";
import { AboutTimeline } from "@/components/about/about-timeline";
import { AboutTeam } from "@/components/about/about-team";
import { AboutContact } from "@/components/about/about-contact";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <LandingHeader />
      <main>
        <AboutHero />
        <AboutStats />
        <AboutStory />
        <AboutValues />
        <AboutTimeline />
        <AboutTeam />
        <AboutContact />
      </main>
      <LandingFooter />
    </div>
  );
}
