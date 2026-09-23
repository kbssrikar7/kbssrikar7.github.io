import { describe, expect, it } from 'vitest';
import { manualProjects } from '@/data/projects.manual';
import { allProjects, featuredProjects, getProject, BUCKET_LABELS } from './projects';

describe('projects', () => {
  it('merges every manual project exactly once', () => {
    expect(allProjects).toHaveLength(manualProjects.length);
    expect(new Set(allProjects.map((p) => p.slug)).size).toBe(manualProjects.length);
  });

  it('assigns every project a known bucket', () => {
    for (const p of allProjects) {
      expect(Object.keys(BUCKET_LABELS)).toContain(p.bucket);
    }
  });

  it('gives every project a distinct hue', () => {
    const hues = allProjects.map((p) => p.hue);
    expect(new Set(hues).size).toBe(hues.length);
  });

  it('caps featured projects and always includes the pinned ones', () => {
    expect(featuredProjects.length).toBeLessThanOrEqual(6);
    expect(featuredProjects.some((p) => p.slug === 'handwritten-equation-solver')).toBe(true);
    expect(featuredProjects.some((p) => p.slug === 'headphonesafety')).toBe(true);
  });

  it('looks projects up by slug', () => {
    const known = manualProjects[0].slug;
    expect(getProject(known)?.slug).toBe(known);
    expect(getProject('does-not-exist')).toBeUndefined();
  });
});
