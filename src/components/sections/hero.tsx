import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { SocialLinks } from '@/components/site/social-links';
import { Spotlight } from '@/components/ui/spotlight-new';
import { ScrambleText } from '@/components/ui/scramble-text';
import { profile, education } from '@/data/profile';

const SIGNAL_GRADIENT = {
  gradientFirst:
    'radial-gradient(68.5% 68.7% at 55% 31.5%, hsla(190, 100%, 85%, .10) 0, hsla(190, 100%, 55%, .03) 50%, transparent 80%)',
  gradientSecond:
    'radial-gradient(50% 50% at 50% 50%, hsla(190, 100%, 85%, .07) 0, hsla(190, 100%, 55%, .02) 80%, transparent 100%)',
  gradientThird:
    'radial-gradient(50% 50% at 50% 50%, hsla(190, 100%, 85%, .05) 0, hsla(190, 100%, 45%, .02) 80%, transparent 100%)',
};

// Each hero line fades up in turn on first paint. Pure CSS (tw-animate), so the
// reduced-motion block in globals.css already neutralises it.
const REVEAL = 'animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out fill-mode-[both]';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
      {/* Faded out at the bottom: overflow-hidden used to cut the beams off in
          a hard horizontal line just under the education row. */}
      <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
        <Spotlight {...SIGNAL_GRADIENT} />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
        <h1
          className={`font-pixel text-[clamp(3.5rem,14vw,8rem)] leading-[0.85] tracking-tight ${REVEAL}`}
        >
          kbs
        </h1>

        <p
          className={`mt-5 font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase ${REVEAL} delay-100`}
        >
          <ScrambleText text={profile.fullName} delay={250} />
        </p>

        {/* text-balance rather than whitespace-nowrap: at the larger size a
            forced single line overflowed the container between lg and xl. */}
        <p
          className={`mt-6 max-w-3xl text-xl leading-relaxed text-balance text-muted-foreground sm:text-2xl ${REVEAL} delay-200`}
        >
          {profile.bio}
        </p>

        <div className={`mt-8 flex flex-wrap items-center gap-3 ${REVEAL} delay-300`}>
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

        <p className={`mt-12 font-mono text-sm text-muted-foreground ${REVEAL} delay-[400ms]`}>
          {education.degree} · {education.school} · {education.period.split(' - ')[1]}
        </p>
      </div>
    </section>
  );
}
