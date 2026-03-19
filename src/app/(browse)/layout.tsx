import Header from "@/components/header/Header";
import ActiveSessionBanner from "@/components/activeSessionBanner/ActiveSessionBanner";

export default function BrowseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Header />
            <ActiveSessionBanner />
            {children}
        </>
    );
}
