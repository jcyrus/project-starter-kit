import * as React from "react";
interface ThemeProviderProps {
    children: React.ReactNode;
    attribute?: "class" | "data-theme";
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
}
export declare function ThemeProvider({ children, ...props }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=theme-provider.d.ts.map