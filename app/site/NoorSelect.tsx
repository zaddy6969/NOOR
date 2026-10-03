"use client";

import { Children, isValidElement, useEffect, useId, useRef, useState, type ChangeEvent, type ReactNode, type SelectHTMLAttributes } from "react";
import { createPortal } from "react-dom";

// Keep the native select for forms, and expose a keyboard-friendly branded popup.
export default function NoorSelect({ children, value, defaultValue, onChange, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(String(defaultValue ?? ""));
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 240, height: 300 });
  const items = Children.toArray(children).flatMap((node) => {
    if (!isValidElement<{ value?: string | number; disabled?: boolean; children?: ReactNode }>(node)) return [];
    return [{ value: String(node.props.value ?? ""), label: node.props.children, disabled: Boolean(node.props.disabled) }];
  });
  const selected = String(value ?? internal);
  const chosen = items.find((item) => item.value === selected);
  const enabled = items.map((item, index) => item.disabled ? -1 : index).filter((index) => index >= 0);
  const choose = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    setInternal(item.value);
    onChange?.({ target: { value: item.value }, currentTarget: { value: item.value } } as ChangeEvent<HTMLSelectElement>);
    setOpen(false);
    button.current?.focus();
  };
  const show = () => {
    if (props.disabled || !enabled.length) return;
    const rect = button.current!.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - 12;
    const height = Math.min(320, Math.max(below, rect.top - 12), window.innerHeight - 24);
    const width = Math.min(Math.max(rect.width, 240), window.innerWidth - 24);
    setPosition({ top: below >= Math.min(220, height) ? rect.bottom + 6 : Math.max(12, rect.top - height - 6), left: Math.min(Math.max(12, rect.left), window.innerWidth - width - 12), width, height });
    setActive(Math.max(enabled[0], items.findIndex((item) => item.value === selected && !item.disabled)));
    setOpen(true);
  };
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: Event) => {
      if (!button.current?.contains(event.target as Node) && !popup.current?.contains(event.target as Node)) setOpen(false);
    };
    const resize = () => setOpen(false);
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  useEffect(() => {
    if (open) document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, id, open]);
  const label = props["aria-label"] ?? props.name ?? "Choose an option";
  return <span className={`noor-select ${props.className ?? ""}`}>
    <select {...props} className="noor-select-native" aria-hidden="true" tabIndex={-1} value={selected} onChange={onChange}>{children}</select>
    <button ref={button} type="button" role="combobox" aria-label={label} aria-expanded={open} aria-controls={`${id}-list`} aria-haspopup="listbox" aria-activedescendant={open ? `${id}-${active}` : undefined} disabled={props.disabled} onClick={() => open ? setOpen(false) : show()} onBlur={(event) => { if (!popup.current?.contains(event.relatedTarget as Node)) setOpen(false); }} onKeyDown={(event) => {
      if (event.key === "Escape") { setOpen(false); event.preventDefault(); }
      else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        if (!open) { show(); return; }
        const current = enabled.indexOf(active);
        setActive(event.key === "Home" ? enabled[0] : event.key === "End" ? enabled.at(-1)! : enabled[(current + (event.key === "ArrowDown" ? 1 : -1) + enabled.length) % enabled.length]);
      } else if (open && ["Enter", " "].includes(event.key)) { event.preventDefault(); choose(active); }
      else if (open && event.key.length === 1 && event.key !== " ") {
        event.preventDefault();
        const next = enabled.find((index) => String(items[index].label).toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()));
        if (next !== undefined) setActive(next);
      }
    }}><span>{chosen?.label ?? "Choose"}</span><span aria-hidden="true">⌄</span></button>
    {open && createPortal(<div ref={popup} id={`${id}-list`} role="listbox" aria-label={label} dir={document.documentElement.dir} className="noor-select-popup" style={{ position: "fixed", top: position.top, left: position.left, width: position.width, maxHeight: position.height }}>
      {items.map((item, index) => <div key={item.value} id={`${id}-${index}`} role="option" aria-selected={item.value === selected} aria-disabled={item.disabled} className={index === active ? "is-active" : ""} onPointerDown={(event) => event.preventDefault()} onPointerMove={() => !item.disabled && setActive(index)} onClick={() => choose(index)}>{item.label}<span aria-hidden="true">{item.value === selected ? "✓" : ""}</span></div>)}
    </div>, document.body)}
  </span>;
}
