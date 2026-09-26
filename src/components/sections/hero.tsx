import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { SocialLinks } from '@/components/site/social-links';
import { Spotlight } from '@/components/ui/spotlight-new';
import { profile, education } from '@/data/profile';

const SIGNAL_GRADIENT = {
  gradientFirst:
    'radial-gradient(68.5% 68.7% at 55% 31.5%, hsla(190, 100%, 85%, .10) 0, hsla(190, 100%, 55%, .03) 50%, transparent 80%)',
  gradientSecond:
    'radial-gradient(50% 50% at 50% 50%, hsla(190, 100%, 85%, .07) 0, hsla(190, 100%, 55%, .02) 80%, transparent 100%)',
  gradientThird:
    'radial-gradient(50% 50% at 50% 50%, hsla(190, 100%, 85%, .05) 0, hsla(190, 100%, 45%, .02) 80%, transparent 100%)',
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
      <Spotlight {...SIGNAL_GRADIENT} />

      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
        <h1 className="font-pixel text-[clamp(3.5rem,14vw,8rem)] leading-[0.85] tracking-tight">
          kbs
        </h1>

        <p className="mt-5 font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase">
          {profile.fullName}
        </p>

        {/* text-balance rather than whitespace-nowrap: at the larger size a
            forced single line overflowed the container between lg and xl. */}
        <p className="mt-6 max-w-3xl text-xl leading-relaxed text-balance text-muted-foreground sm:text-2xl">
          {profile.bio}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
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

        <p className="mt-12 font-mono text-sm text-muted-foreground">
          {education.degree} · {education.school} · {education.period.split(' - ')[1]}
        </p>
      </div>
    </section>
  );
}
