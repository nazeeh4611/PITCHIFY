// // Layout/dialog.tsx
// import * as React from "react";
// import * as DialogPrimitive from "@radix-ui/react-dialog";
// import { X } from "lucide-react";

// const Dialog = DialogPrimitive.Root;

// const DialogContent = React.forwardRef<
//   React.ElementRef<typeof DialogPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
// >(({ className = "", children, ...props }, ref) => (
//   <DialogPrimitive.Portal>
//     <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80">
//       <DialogPrimitive.Content
//         ref={ref}
//         className={`fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg sm:rounded-lg ${className}`}
//         {...props}
//       >
//         {children}
//         <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
//           <X className="h-4 w-4" />
//           <span className="sr-only">Close</span>
//         </DialogPrimitive.Close>
//       </DialogPrimitive.Content>
//     </DialogPrimitive.Overlay>
//   </DialogPrimitive.Portal>
// ));

// DialogContent.displayName = "DialogContent";

// export { Dialog, DialogContent };