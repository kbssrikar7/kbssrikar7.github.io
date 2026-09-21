import { socials, type SocialKey } from '@/data/profile';
import {
  GithubIcon,
  LinkedinIcon,
  XIcon,
  HuggingFaceIcon,
  MonkeytypeIcon,
} from '@/components/site/icons';
import { cn } from '@/lib/utils';

export const SOCIAL_ICONS: Record<SocialKey, React.ComponentType<React.SVGProps<SVGSVGElement>>> =
  {
    github: GithubIcon,
    linkedin: LinkedinIcon,
    x: XIcon,
    huggingface: HuggingFaceIcon,
    monkeytype: MonkeytypeIcon,
  };

export function SocialLinks({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {socials.map((s) => {
        const Icon = SOCIAL_ICONS[s.key];
        return (
          <a
            key={s.key}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${s.label} (@${s.handle})`}
            title={s.label}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon style={{ width: size, height: size }} />
          </a>
        );
      })}
    </div>
  );
}
