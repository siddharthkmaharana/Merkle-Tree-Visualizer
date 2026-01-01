import React, { useState, useRef } from "react";

export function HoverCard({ children, openDelay = 100 }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setOpen(true), openDelay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { open })
      )}
    </div>
  );
}

export function HoverCardTrigger({ asChild, children, open }) {
  // Pass-through trigger element
  return asChild ? children : <div>{children}</div>;
}

export function HoverCardContent({ className = "", children, open }) {
  if (!open) return null; // ← Hide when not hovered

  return (
    <div
      className={`absolute left-0 top-full mt-2 z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
