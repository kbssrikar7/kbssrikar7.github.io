import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { SocialLinks } from '@/components/site/social-links';
import { Spotlight } from '@/components/ui/spotlight-new';
import { ScrambleText } from '@/components/ui/scramble-text';
import { profile, education } from '@/data/profile';

// Beams in the theme's --spot colour and strength, so they read on both
// backgrounds: pale cyan light on dark, a denser teal shade on light.
const beam = (pct: number) =>
  `color-mix(in oklch, var(--spot) calc(${pct}% * var(--spot-strength)), transparent)`;
const SIGNAL_GRADIENT = {
  gradientFirst: `radial-gradient(68.5% 68.7% at 55% 31.5%, ${beam(10)} 0, ${beam(3)} 50%, transparent 80%)`,
  gradientSecond: `radial-gradient(50% 50% at 50% 50%, ${beam(7)} 0, ${beam(2)} 80%, transparent 100%)`,
  gradientThird: `radial-gradient(50% 50% at 50% 50%, ${beam(5)} 0, ${beam(2)} 80%, transparent 100%)`,
};

// Each hero line fades up in turn on first paint. Pure CSS (tw-animate), so the
// reduced-motion block in globals.css already neutralises it. Half a second
// each, 75ms apart: the whole intro settles in ~0.8s (it was 1.6s, and
// PageSpeed's Speed Index counted every frame of it as still loading).
const REVEAL = 'animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out fill-mode-[both]';
// The h1 slides in but never starts invisible: Chrome does not count text
// painted at opacity 0 toward LCP, so a fade-in held the name (the home page's
// LCP element) back until the next repaint - ~5s later on a throttled phone.
const SLIDE = 'animate-in slide-in-from-bottom-3 duration-500 ease-out fill-mode-[both]';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-16">
      {/* Faded out at the bottom: overflow-hidden used to cut the beams off in
          a hard horizontal line just under the education row. */}
      <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
        <Spotlight {...SIGNAL_GRADIENT} />
      </div>

      <div data-hero-drift className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
        {/* One h1 holding both the wordmark and the full name, so the page's
            main heading - what search engines weigh most - carries the name
            people actually search for, not just "kbs". Looks identical. */}
        <h1>
          <span
            className={`block font-pixel text-[clamp(3.5rem,14vw,8rem)] leading-[0.85] tracking-tight ${SLIDE}`}
          >
            kbs
          </span>
          <span
            className={`mt-5 block font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase ${SLIDE} delay-75`}
          >
            <ScrambleText text={profile.fullName} delay={175} duration={700} replayOnHover="self" />
          </span>
        </h1>

        {/* text-balance rather than whitespace-nowrap: at the larger size a
            forced single line overflowed the container between lg and xl. */}
        <p
          className={`mt-6 max-w-3xl text-xl leading-relaxed text-balance text-muted-foreground sm:text-2xl ${REVEAL} delay-150`}
        >
          {profile.bio}
        </p>

        <div className={`mt-8 flex flex-wrap items-center gap-3 ${REVEAL} delay-[225ms]`}>
          <Link
            href="/resume"
            className="group inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-base font-medium text-background transition-opacity hover:opacity-90"
          >
            resume
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-base transition-colors hover:border-signal/40 hover:text-signal"
          >
            <Mail className="size-4" />
            get in touch
          </a>

          <SocialLinks className="ml-1" />
        </div>

        <p className={`mt-12 font-mono text-sm text-muted-foreground ${REVEAL} delay-300`}>
          {education.degree} · {education.school} · {education.period.split(' - ')[1]}
        </p>
      </div>
    </section>
  );
}
