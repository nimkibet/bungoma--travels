"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import routes from "@/data/routes.json";

export function ActiveNavLink({ className, ...props }) {
  const pathname = usePathname();

  const activeLink = (link) => {
    if (pathname.startsWith(link)) {
      return "border-b-4 border-terracotta-600 text-terracotta-500";
    }
    return "text-inherit hover:text-terracotta-400";
  };

  return (
    <div className={cn(className)} {...props}>
      <Button
        asChild
        variant={"link"}
        className={"h-[inherit] rounded-none px-4 py-2 font-bold transition-all duration-200"}
      >
        <Link
          href={routes.attractions.path}
          className={cn("inline-flex items-center gap-2 text-base font-semibold", activeLink(routes.attractions.path))}
        >
          {/* Compass Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          <span>{routes.attractions.title}</span>
        </Link>
      </Button>

      <Button
        asChild
        variant={"link"}
        className={"h-[inherit] rounded-none px-4 py-2 font-bold transition-all duration-200"}
      >
        <Link
          href="/package-builder"
          className={cn("inline-flex items-center gap-2 text-base font-semibold", activeLink("/package-builder"))}
        >
          <span>🎒 Build Package</span>
        </Link>
      </Button>

    </div>
  );
}
