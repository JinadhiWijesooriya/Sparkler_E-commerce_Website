import type { PropsWithChildren } from "react";
export declare const Section: ({ title, children, }: PropsWithChildren<{
    title: string;
}>) => import("react/jsx-runtime").JSX.Element;
export declare const Grid: ({ children }: PropsWithChildren) => import("react/jsx-runtime").JSX.Element;
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}
export declare const Input: ({ error, ...props }: InputProps) => import("react/jsx-runtime").JSX.Element;
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
}
export declare const Select: ({ error, children, ...props }: SelectProps) => import("react/jsx-runtime").JSX.Element;
export declare const PrimaryButton: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => import("react/jsx-runtime").JSX.Element;
export declare const SecondaryButton: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => import("react/jsx-runtime").JSX.Element;
