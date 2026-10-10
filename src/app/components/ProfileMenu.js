"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import SignOutButton from "./SignOutButton";

export default function ProfileMenu({ user }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const name = user?.name?.trim() || "ব্যবহারকারী";
  const firstName = name.split(/\s+/)[0];
  const email = user?.email || "";
  const image = user?.image || "";

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative shrink-0">
      {/* Profile button */}
      <button
        type="button"
        aria-label="প্রোফাইল মেনু"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-green-200"
      >
        {/* Profile picture or initials */}
        {image ? (
          <img
            src={image}
            alt=""
            referrerPolicy="no-referrer"
            className="h-8 w-8 shrink-0 rounded-full border border-line object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-alt text-sm font-bold text-bazar-green">
            {name.charAt(0).toUpperCase()}
          </span>
        )}

        {/* First name */}
        <span className="max-w-24 truncate text-xs font-semibold text-ink sm:max-w-32 sm:text-sm">
          {firstName}
        </span>

        {/* Dropdown arrow */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="m7 10 5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[100] mt-2 w-56 overflow-hidden rounded-xl border border-line bg-white p-2 shadow-lg sm:w-60"
        >
          {/* User information */}
          <div className="border-b border-line px-3 py-3">
            <p className="truncate text-sm font-bold text-ink">
              {name}
            </p>

            <p className="mt-1 break-all text-[11px] text-muted">
              {email}
            </p>
          </div>

          {/* Profile */}
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-ink transition hover:bg-surface-alt hover:text-bazar-green"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="8"
                r="4"
                stroke="currentColor"
                strokeWidth="1.7"
              />

              <path
                d="M4.5 20a7.5 7.5 0 0 1 15 0"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>

            আমার প্রোফাইল
          </Link>

          {/* Update information */}
          <Link
            href="/profile/update"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-ink transition hover:bg-surface-alt hover:text-bazar-green"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 20h9"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <path
                d="m16.5 3.5 4 4L9 19l-5 1 1-5L16.5 3.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            তথ্য আপডেট করুন
          </Link>

          {/* Sign out */}
          <div className="mt-1 border-t border-line pt-1">
            <SignOutButton
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-red-600 transition hover:bg-red-50"
            />
          </div>
        </div>
      )}
    </div>
  );
}