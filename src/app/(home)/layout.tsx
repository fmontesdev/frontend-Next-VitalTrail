import HeaderHome from "@/components/header/HeaderHome";
import Footer from "@/components/footer/Footer";

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <HeaderHome />
            {children}
            <Footer />
        </>
    );
}
