import Header from "@/components/header/Header";
import ActiveSessionBanner from "@/components/activeSessionBanner/ActiveSessionBanner";
import Footer from "@/components/footer/Footer";

export default function BrowseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Header />
            <ActiveSessionBanner />
            {children}
            <Footer />
        </>
    );
}
