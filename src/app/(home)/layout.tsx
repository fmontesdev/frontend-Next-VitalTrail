import HeaderHome from "@/components/header/HeaderHome";

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <HeaderHome />
            {children}
        </>
    );
}
