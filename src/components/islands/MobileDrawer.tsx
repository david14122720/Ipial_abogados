import { useState, useEffect, useRef, useCallback } from "react";

const LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#quienes-somos", label: "Quiénes somos" },
  { href: "#abogados", label: "Abogados" },
  { href: "#servicios", label: "Servicios" },
  { href: "#porque-elegirnos", label: "Por qué elegirnos" },
  { href: "#contacto", label: "Contacto" },
];

export default function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    prevFocusRef.current?.focus();
  }, []);

  const toggle = useCallback(() => {
    if (!open) prevFocusRef.current = document.activeElement as HTMLElement | null;
    setOpen((v) => !v);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const first = drawerRef.current?.querySelector("a") as HTMLElement | null;
      first?.focus();
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) close();
      if (e.key === "Tab" && open && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        aria-label={open ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
        onClick={toggle}
        className="md:hidden p-2 -mr-1 text-on-surface header-menu-icon focus-visible:outline-2 focus-visible:outline-emerald-deep focus-visible:outline-offset-2 rounded-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {open && (
        <div
          aria-hidden="true"
          onClick={close}
          className="md:hidden fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40"
        />
      )}

      <div
        id="mobile-drawer"
        ref={drawerRef}
        hidden={!open}
        className="md:hidden absolute top-full left-0 w-full bg-surface border-t border-outline-variant shadow-lg z-50"
      >
        <nav className="flex flex-col px-6 py-6 gap-2 text-[17px]" aria-label="Navegación móvil">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={close}
              className="text-on-surface-variant hover:text-primary py-3 px-2 rounded-sm active:bg-surface-container"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
