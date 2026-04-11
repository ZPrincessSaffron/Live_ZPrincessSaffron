import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Info } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed z-[100] flex flex-col items-center pointer-events-none top-[80px] left-1/2 -translate-x-1/2 w-[90%] max-w-[400px]",
      "md:top-0 md:right-0 md:left-auto md:translate-x-0 md:w-full md:max-w-[420px] md:p-4 md:pointer-events-auto md:items-end",
      "lg:bottom-6 lg:right-6 lg:top-auto lg:left-auto lg:translate-x-0 lg:max-w-md lg:items-end lg:p-0",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex items-center justify-between space-x-4 overflow-hidden shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full md:data-[state=open]:sm:slide-in-from-bottom-full lg:data-[state=open]:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "bg-royal-purple-dark text-ivory rounded-lg h-10 py-0 px-4 w-fit max-w-[90vw] min-h-0 flex-row gap-2 border-none shadow-elegant md:border md:border-gold/30 md:bg-ivory md:text-royal-purple md:shadow-elegant md:rounded-xl md:text-center md:flex-col md:items-center md:justify-center md:gap-1 md:py-4 md:px-6 md:min-w-[320px] md:w-full lg:bg-ivory lg:text-royal-purple lg:border-gold/30 lg:rounded-2xl lg:p-6 lg:min-h-[70px] lg:h-auto lg:py-5 lg:px-8 lg:min-w-[380px] lg:w-auto lg:shadow-elegant lg:flex-row lg:items-center lg:gap-4",
        destructive: "destructive group bg-royal-purple-dark text-ivory border-none rounded-lg h-10 py-0 px-4 w-fit flex-row md:border md:border-destructive md:bg-destructive md:text-destructive-foreground md:h-auto md:p-6 md:pr-8 md:rounded-md lg:bg-destructive lg:text-destructive-foreground lg:rounded-xl lg:min-h-[70px] lg:py-5 lg:px-8",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props}>
      <div className="flex items-center justify-center w-full flex-row gap-2 md:flex-col md:gap-1 lg:flex-row lg:gap-4 lg:justify-start">
         {variant !== "destructive" && (
           <Info className="h-4 w-4 text-gold md:h-5 md:w-5 md:mb-2 lg:mb-0 lg:h-5 lg:w-5" />
         )}
         <div className="flex items-center flex-row gap-1 md:flex-col lg:flex-row lg:gap-2">
           {props.children}
         </div>
      </div>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("font-semibold font-sans text-[13px] tracking-normal capitalize whitespace-nowrap md:text-sm md:font-cinzel md:tracking-widest md:uppercase lg:text-sm lg:font-cinzel lg:tracking-[0.1em]", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
