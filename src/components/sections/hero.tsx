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
        <span className="inline-flex items-center gap-2 rounded-full border border-signal/25 bg-signal/[0.06] px-3 py-1 font-mono text-[11px] tracking-wide text-signal">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
          </span>
          {profile.availability}
        </span>

        <h1 className="font-pixel mt-7 text-[clamp(3.5rem,14vw,8rem)] leading-[0.85] tracking-tight">
          kbs
        </h1>

        <p className="mt-5 font-mono text-[11px] tracking-[0.2em] text-muted-foreground/70 uppercase">
          {profile.fullName}
        </p>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {profile.bio}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="/resume"
            className="group inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            resume
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm transition-colors hover:border-signal/40 hover:text-signal"
          >
            <Mail className="size-4" />
            get in touch
          </a>

          <SocialLinks className="ml-1" />
        </div>

        <p className="mt-10 font-mono text-[13px] text-muted-foreground/75">
          {education.degree} · {education.school} · {education.period.split(' - ')[1]}
        </p>
      </div>
    </section>
  );
}
