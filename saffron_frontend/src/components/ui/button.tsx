import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        royal: "", // NEW VARIANT
        section: "",
        white: "",
        google:"",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  variant?: "default" | "royal" | "section" | "white" | "google" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size, asChild = false, children, ...props }, ref) => {

    /* ================= DEFAULT WHITE BUTTON ================= */
    if (variant === "default" && !asChild) {
      return (
        <button
          ref={ref}
          {...props}
          className={cn(
            `
            relative inline-flex items-center justify-center
            rounded-full
            bg-white
            text-[#2E0F3A]
            h-[44px] min-w-[210px] px-10
            font-sans text-[12px] font-semibold
            tracking-[0.22em] uppercase
            border-none outline-none focus:ring-0
            overflow-visible
            transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]
            group
            hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)]
            `,
            className
          )}
        >
          <svg
            className="absolute -inset-[1px] w-[calc(100%+2px)] h-[calc(100%+2px)] pointer-events-none"
            viewBox="0 0 302 46"
            preserveAspectRatio="none"
          >
            <rect
              x="1"
              y="1"
              width="300"
              height="44"
              rx="23"
              ry="23"
              fill="none"
              stroke="#2E0F3A"
              strokeWidth="1.2"
              strokeDasharray="760"
              strokeDashoffset="760"
              className="border-run"
            />
          </svg>

          <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-x-3">
            {children}
          </span>

          {/* Arrow */}
          <span className="absolute right-6 opacity-0 translate-x-2 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:opacity-100 group-hover:translate-x-0">
            <svg
              width="18"
              height="12"
              viewBox="0 0 24 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="2" y1="6" x2="20" y2="6" />
              <polyline points="14 1 20 6 14 11" />
            </svg>
          </span>

          <style>
            {`
              @keyframes runBorder {
                from { stroke-dashoffset: 760; }
                to { stroke-dashoffset: 0; }
              }
              .group:hover .border-run {
                animation: runBorder 1.1s ease forwards;
              }
              .group:not(:hover) .border-run {
                stroke-dashoffset: 760;
              }
            `}
          </style>
        </button>
      )
    }

/* ================= GOOGLE SIGN IN BUTTON ================= */
if (variant === "google" && !asChild) {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        `
        relative inline-flex items-center justify-center gap-3
        rounded-full
        bg-white
        text-[#1F1F1F]
        h-[44px] min-w-[210px] px-6 md:px-10
        font-sans text-[11px] md:text-[12px] font-semibold
        tracking-[0.1em] md:tracking-[0.18em] uppercase
        border border-[#E5E5E5]
        outline-none focus:ring-0
        transition-all duration-300
        hover:shadow-[0_10px_25px_rgba(0,0,0,0.12)]
        whitespace-nowrap
        `,
        className
      )}
    >
      {/* Google Logo */}
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.2 3.6l6.9-6.9C35.9 2.2 30.4 0 24 0 14.6 0 6.6 5.5 2.7 13.5l8.1 6.3C12.6 13 17.8 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-2.7-.4-4H24v7.6h12.7c-.3 1.9-1.8 4.8-5.1 6.7l7.8 6c4.6-4.3 7.1-10.5 7.1-16.3z"/>
        <path fill="#FBBC05" d="M10.8 28.8c-.6-1.8-1-3.7-1-5.8s.4-4 1-5.8l-8.1-6.3C1 15.1 0 19.4 0 23s1 7.9 2.7 11.1l8.1-5.3z"/>
        <path fill="#34A853" d="M24 46c6.5 0 12-2.1 16-5.7l-7.8-6c-2.2 1.5-5.1 2.5-8.2 2.5-6.2 0-11.4-3.5-13.2-8.3l-8.1 5.3C6.6 42.5 14.6 48 24 48z"/>
      </svg>

      <span className="relative z-10">
        Continue with Google
      </span>
    </button>
  )
}

    /* ================= SECTION PURPLE BUTTON (WITH ARROW) ================= */
if (variant === "section" && !asChild) {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        `
        relative inline-flex items-center justify-center
        rounded-full
        bg-[#2E0F3A]
        text-[#F5F1E8]
        h-[44px] min-w-[210px] px-10
        font-sans text-[12px] font-semibold
        tracking-[0.22em] uppercase
        border-none outline-none focus:ring-0
        overflow-visible
        transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]
        group
        hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]
        `,
        className
      )}
    >
      {/* Running Border */}
      <svg
        className="absolute -inset-[1px] w-[calc(100%+2px)] h-[calc(100%+2px)] pointer-events-none"
        viewBox="0 0 302 46"
        preserveAspectRatio="none"
      >
        <rect
          x="1"
          y="1"
          width="300"
          height="44"
          rx="23"
          ry="23"
          fill="none"
          stroke="#F5F1E8"
          strokeWidth="1.2"
          strokeDasharray="760"
          strokeDashoffset="760"
          className="border-run"
        />
      </svg>

      {/* Text */}
      <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-x-3">
        {children}
      </span>

      {/* Arrow (SAME AS DEFAULT) */}
      <span className="absolute right-6 opacity-0 translate-x-2 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:opacity-100 group-hover:translate-x-0">
        <svg
          width="18"
          height="12"
          viewBox="0 0 24 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="2" y1="6" x2="20" y2="6" />
          <polyline points="14 1 20 6 14 11" />
        </svg>
      </span>

      <style>
        {`
          @keyframes runBorder {
            from { stroke-dashoffset: 760; }
            to { stroke-dashoffset: 0; }
          }
          .group:hover .border-run {
            animation: runBorder 1.1s ease forwards;
          }
          .group:not(:hover) .border-run {
            stroke-dashoffset: 760;
          }
        `}
      </style>
    </button>
  )
}

/* ================= WHITE BUTTON (NO ARROW) ================= */
if (variant === "white" && !asChild) {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        `
        relative inline-flex items-center justify-center
        rounded-full
        bg-white
        text-[#2E0F3A]
        h-[44px] min-w-[210px] px-10
        font-sans text-[12px] font-semibold
        tracking-[0.22em] uppercase
        border-none outline-none focus:ring-0
        overflow-visible
        transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]
        group
        hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)]
        `,
        className
      )}
    >
      {/* Running Border */}
      <svg
        className="absolute -inset-[1px] w-[calc(100%+2px)] h-[calc(100%+2px)] pointer-events-none"
        viewBox="0 0 302 46"
        preserveAspectRatio="none"
      >
        <rect
          x="1"
          y="1"
          width="300"
          height="44"
          rx="23"
          ry="23"
          fill="none"
          stroke="#2E0F3A"
          strokeWidth="1.2"
          strokeDasharray="760"
          strokeDashoffset="760"
          className="border-run"
        />
      </svg>

      {/* Text (NO ARROW SHIFT) */}
      <span className="relative z-10 transition-all duration-500">
        {children}
      </span>

      <style>
        {`
          @keyframes runBorder {
            from { stroke-dashoffset: 760; }
            to { stroke-dashoffset: 0; }
          }
          .group:hover .border-run {
            animation: runBorder 1.1s ease forwards;
          }
          .group:not(:hover) .border-run {
            stroke-dashoffset: 760;
          }
        `}
      </style>
    </button>
  )
}

    /* ================= ROYAL PURPLE BUTTON ================= */
    if (variant === "royal" && !asChild) {
      return (
        <button
          ref={ref}
          {...props}
          className={cn(
            `
            relative inline-flex items-center justify-center
            rounded-full
            bg-[#2E0F3A]
            text-[#F5F1E8]
            h-[44px] min-w-[210px] px-10
            font-sans text-[12px] font-semibold
            tracking-[0.22em] uppercase
            border-none outline-none focus:ring-0
            overflow-visible
            transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]
            group
            hover:shadow-[0_12px_35px_rgba(46,15,58,0.35)]
            `,
            className
          )}
        >
          <svg
            className="absolute -inset-[1px] w-[calc(100%+2px)] h-[calc(100%+2px)] pointer-events-none"
            viewBox="0 0 302 46"
            preserveAspectRatio="none"
          >
            <rect
              x="1"
              y="1"
              width="300"
              height="44"
              rx="23"
              ry="23"
              fill="none"
              stroke="#F5F1E8"
              strokeWidth="1.2"
              strokeDasharray="760"
              strokeDashoffset="760"
              className="border-run"
            />
          </svg>

          {/* No Arrow Here */}
          <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1">
            {children}
          </span>

          <style>
            {`
              @keyframes runBorder {
                from { stroke-dashoffset: 760; }
                to { stroke-dashoffset: 0; }
              }
              .group:hover .border-run {
                animation: runBorder 1.1s ease forwards;
              }
              .group:not(:hover) .border-run {
                stroke-dashoffset: 760;
              }
            `}
          </style>
        </button>
      )
    }

    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
