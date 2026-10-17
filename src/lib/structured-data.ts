import { education, profile, socials, stack } from '@/data/profile';
import type { Project } from '@/lib/projects';

/**
 * schema.org JSON-LD. Search engines use it to tie this site to the person:
 * every spelling of the name, the degree, and the profiles in `sameAs` - so a
 * search for "K.B.S Srikar" or the full name lands here, and the GitHub /
 * LinkedIn / X results are understood as the same person.
 */
const PERSON_ID = `${profile.siteUrl}/#person`;

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: profile.name,
        alternateName: [profile.fullName, 'KBS Srikar', 'Srikar Kasilanka', profile.handle],
        givenName: 'Bhoopesh Siva Srikar',
        familyName: 'Kasilanka',
        jobTitle: 'Software Engineer',
        description: profile.bio,
        url: `${profile.siteUrl}/`,
        image: `${profile.siteUrl}/opengraph-image.png`,
        email: `mailto:${profile.email}`,
        nationality: { '@type': 'Country', name: 'India' },
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: education.school,
          sameAs: 'https://vit.ac.in',
        },
        knowsAbout: stack.flatMap((g) => g.items),
        sameAs: socials.map((s) => s.href),
      },
      {
        // Google reads the site name in results from here; the alternates are
        // how people search for it ("srikar portfolio").
        '@type': 'WebSite',
        '@id': `${profile.siteUrl}/#website`,
        url: `${profile.siteUrl}/`,
        name: profile.name,
        alternateName: [`${profile.name} Portfolio`, 'Srikar Portfolio', 'KBS Srikar Portfolio', profile.handle],
        publisher: { '@id': PERSON_ID },
      },
      {
        // The home page is a profile page about one person - the structured
        // data type Google supports for personal sites.
        '@type': 'ProfilePage',
        '@id': `${profile.siteUrl}/#profile`,
        url: `${profile.siteUrl}/`,
        name: `${profile.name} - Software Engineer Portfolio`,
        mainEntity: { '@id': PERSON_ID },
        isPartOf: { '@id': `${profile.siteUrl}/#website` },
      },
    ],
  };
}

export function projectJsonLd(project: Project) {
  const url = `${profile.siteUrl}/projects/${project.slug}/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [projectSource(project, url), breadcrumbs('Projects', '/projects/', project.title, url)],
  };
}

function breadcrumbs(section: string, sectionPath: string, title: string, url: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${profile.siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: section, item: `${profile.siteUrl}${sectionPath}` },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
  };
}

function projectSource(project: Project, url: string) {
  return {
    // A project with no public repo (client work) is a published work, not
    // source code anyone can read - claiming SoftwareSourceCode would be wrong.
    '@type': project.repoUrl ? 'SoftwareSourceCode' : 'CreativeWork',
    name: project.title,
    description: project.blurb,
    url,
    ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
    keywords: project.tech.join(', '),
    // targetProduct only exists on SoftwareSourceCode. For client work the live
    // site IS the work, so it is the same thing at another URL.
    ...(project.liveUrl
      ? project.repoUrl
        ? { targetProduct: { '@type': 'SoftwareApplication', name: project.title, url: project.liveUrl } }
        : { sameAs: project.liveUrl }
      : {}),
    author: { '@type': 'Person', '@id': PERSON_ID, name: profile.name, url: `${profile.siteUrl}/` },
  };
}

/** Serialise for a <script type="application/ld+json">, safe against "</script>" in data. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
