import Header from "@/components/header/Header";

export default function BrowseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}
