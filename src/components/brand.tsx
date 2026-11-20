import { profile } from "@/config/portfolio";

export function Brand({ href = "#home" }: { href?: string }) {
  return (
    <a href={href} className="brand inline-flex items-center gap-3" aria-label={`${profile.name}, home`}>
      <span aria-hidden="true" className="boardmark"><i /><i /><i /><i /></span>
      {profile.name}
    </a>
  );
}
