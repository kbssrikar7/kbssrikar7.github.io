import type { Metadata } from 'next';
import { Download } from 'lucide-react';
import { Section } from '@/components/sections/section';
import { profile, education, stack } from '@/data/profile';
import { experience } from '@/data/experience';

export const metadata: Metadata = {
  title: 'Resume',
  description: `Resume for ${profile.fullName} - ${profile.tagline}.`,
};

export default function ResumePage() {
  return (
    <Section label="resume" title={profile.fullName}>
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={profile.resume}
          download
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <Download className="size-4" />
          download pdf
        </a>
        <a
          href={profile.resume}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm transition-colors hover:border-signal/40 hover:text-signal"
        >
          open in new tab
        </a>
      </div>

      {/* The embed fails on mobile Safari and for crawlers, so the same content
          is written out below it rather than hidden behind the object. */}
      <object
        data={profile.resume}
        type="application/pdf"
        className="mt-8 hidden h-[900px] w-full rounded-xl border border-border sm:block"
        aria-label="Resume PDF"
      >
        <p className="p-6 text-sm text-muted-foreground">
          Your browser can&apos;t display the PDF inline.{' '}
          <a href={profile.resume} className="underline hover:text-signal">
            Download it instead
          </a>
          .
        </p>
      </object>

      <div className="mt-12 space-y-12">
        <div>
          <h3 className="font-mono text-[13px] tracking-[0.2em] text-muted-foreground uppercase">
            experience
          </h3>
          {experience.map((job) => (
            <div key={job.company} className="mt-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <p className="tracking-tight">
                  {job.role}, {job.company}
                </p>
                <p className="font-mono text-[13px] text-muted-foreground">{job.period}</p>
              </div>
              <ul className="mt-4 space-y-2">
                {job.bullets.map((b) => (
                  <li
                    key={b}
                    className="relative max-w-2xl pl-4 text-sm leading-relaxed text-muted-foreground before:absolute before:top-[0.6em] before:left-0 before:size-1 before:rounded-full before:bg-muted-foreground/40"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-mono text-[13px] tracking-[0.2em] text-muted-foreground uppercase">
            education
          </h3>
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4">
            <p className="tracking-tight">
              {education.degree}, {education.school}
            </p>
            <p className="font-mono text-[13px] text-muted-foreground">{education.period}</p>
          </div>
          <p className="mt-2 font-mono text-[13px] text-muted-foreground">
            CGPA {education.cgpa}
          </p>
        </div>

        <div>
          <h3 className="font-mono text-[13px] tracking-[0.2em] text-muted-foreground uppercase">
            skills
          </h3>
          <dl className="mt-4 space-y-3">
            {stack.map((g) => (
              <div key={g.label} className="flex flex-wrap gap-x-3 text-sm">
                <dt className="w-32 shrink-0 font-mono text-[13px] text-muted-foreground">
                  {g.label}
                </dt>
                <dd className="flex-1 text-muted-foreground">{g.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
