import Link from "next/link";
import { Icon } from "../Icon";
import type { ReactNode } from "react";

export type Cta = { label?: string; href?: string; icon?: string };

/** Rich inline HTML from content (bold, span.hl, span.em, br). Content is authored in-house. */
export function Rich({ html, className, style, as: Tag = "span" }: { html?: string; className?: string; style?: React.CSSProperties; as?: keyof React.JSX.IntrinsicElements }) {
  const T = Tag as React.ElementType;
  return <T className={className} style={style} dangerouslySetInnerHTML={{ __html: html || "" }} />;
}

export function Btn({
  cta,
  variant = "primary",
  size,
  showArrow,
  children,
}: {
  cta?: Cta;
  variant?: "primary" | "secondary";
  size?: "lg";
  showArrow?: boolean;
  children?: ReactNode;
}) {
  if (!cta?.label) return null;
  const cls = `btn btn-${variant}${size ? " btn-" + size : ""}`;
  const inner = (
    <>
      <span>{cta.label}</span>
      {cta.icon ? <Icon name={cta.icon} /> : showArrow ? <Icon name="arrow-right" /> : null}
      {children}
    </>
  );
  const href = cta.href || "#";
  return href.startsWith("/") ? (
    <Link className={cls} href={href}>{inner}</Link>
  ) : (
    <a className={cls} href={href}>{inner}</a>
  );
}

/** Image slot: renders a real photo when `src` is set, else the spec'd dashed placeholder. */
export function PhotoSlot({
  src,
  alt,
  ratio,
  variant,
  tag,
  label,
  spec,
}: {
  src?: string;
  alt?: string;
  ratio?: string;
  variant?: "portrait" | "card" | "square";
  tag?: string;
  label?: string;
  spec?: string;
}) {
  const cls = `ph${variant ? " ph--" + variant : ""}`;
  const style = ratio ? ({ ["--ph-ratio" as string]: ratio } as React.CSSProperties) : undefined;
  return (
    <div className={cls} style={style}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || ""} />
      ) : (
        <span className="ph-label">
          {tag && <span className="ph-tag">{tag}</span>}
          {label}
          {spec && <span className="ph-spec">{spec}</span>}
        </span>
      )}
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  center,
  style,
  className,
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
  center?: boolean;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div className={`section-head${className ? " " + className : ""}`} style={{ ...(center ? { textAlign: "center", margin: "0 auto" } : {}), ...style }}>
      {eyebrow && <Rich as="span" className="eyebrow" html={eyebrow} style={center ? { justifyContent: "center" } : undefined} />}
      {title && <Rich as="h2" html={title} />}
      {lead && <Rich as="p" className="lead" html={lead} />}
    </div>
  );
}
