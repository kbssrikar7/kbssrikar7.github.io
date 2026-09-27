/** foo.webp -> foo-1200.webp. Shared by scripts/shots.ts and lib/projects.ts. */
export function thumbName(file: string): string {
  return file.replace(/\.webp$/, '-1200.webp');
}
