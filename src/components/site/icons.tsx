/**
 * lucide-react v1 dropped brand icons, and pulling a 6000-icon package for a
 * handful of glyphs is not worth the bundle. Paths are from simple-icons.
 */
type Props = React.SVGProps<SVGSVGElement>;

export function GithubIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M12 .297a12 12 0 0 0-3.793 23.387c.6.111.82-.261.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.333-5.467-5.932 0-1.31.468-2.382 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 3.004-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.839 1.234 1.911 1.234 3.221 0 4.61-2.807 5.625-5.48 5.922.43.372.814 1.102.814 2.222 0 1.604-.015 2.898-.015 3.292 0 .319.216.694.825.576A12 12 0 0 0 12 .297Z" />
    </svg>
  );
}

export function LinkedinIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0Z" />
    </svg>
  );
}

export function XIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
    </svg>
  );
}

/**
 * Hugging Face ships an emoji-style mark (a face with two hands). It is lovely
 * at 48px and unreadable mush at the 16-18px these rows use, sitting next to
 * flat marks like GitHub and X. This is a plain monogram instead: legible at
 * icon size and consistent with the rest of the set.
 */
export function HuggingFaceIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden focusable="false" {...props}>
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <text
        x="12"
        y="15.9"
        textAnchor="middle"
        fill="currentColor"
        fontSize="9.5"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        HF
      </text>
    </svg>
  );
}

export function MonkeytypeIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M20 14.4a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6ZM8.8 14.4h4.8a.8.8 0 1 1 0 1.6H8.8a.8.8 0 1 1 0-1.6ZM7.2 9.6a.8.8 0 0 1 .8.8V12a.8.8 0 1 1-1.6 0v-1.6a.8.8 0 0 1 .8-.8Z M3.201 10.359A2.4 2.4 0 0 1 7.2 8.612a2.4 2.4 0 0 1 4 1.788V12a.8.8 0 1 1-1.6 0v-1.6a.8.8 0 1 0-1.6 0V12a.8.8 0 1 1-1.6 0v-1.6a.8.8 0 1 0-1.6 0V12a.8.8 0 1 1-1.6 0v-1.6l.001-.041ZM17.6 12.8v2.4a.8.8 0 1 1-1.6 0v-2.4h-2.306c-.493 0-.894-.358-.894-.8 0-.442.401-.8.894-.8h6.212c.493 0 .894.358.894.8 0 .442-.401.8-.894.8H17.6ZM16.8 8H20a.8.8 0 1 1 0 1.6h-3.2a.8.8 0 1 1 0-1.6ZM4 14.4h1.6a.8.8 0 1 1 0 1.6H4a.8.8 0 1 1 0-1.6ZM13.2 8h.4a.8.8 0 1 1 0 1.6h-.4a.8.8 0 1 1 0-1.6Z M1.6 14.4H0V8.8c0-2.208 1.792-4 4-4h16c2.208 0 4 1.792 4 4v6.4c0 2.208-1.792 4-4 4H4c-2.208 0-4-1.792-4-4v-1.6h1.6v1.6A2.4 2.4 0 0 0 4 17.6h16a2.4 2.4 0 0 0 2.4-2.4V8.8A2.4 2.4 0 0 0 20 6.4H4a2.4 2.4 0 0 0-2.4 2.4v5.6Z" />
    </svg>
  );
}
