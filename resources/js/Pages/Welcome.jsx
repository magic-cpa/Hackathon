import { Head } from "@inertiajs/react";
import Navbar from "@/pages/Homepage/navbar";
import Hero from "@/pages/Homepage/Hero";
import ProductsGrid from "@/pages/Homepage/ProductsGrid";
import Footer from "@/pages/Homepage/Footer";
import ServicesSection from "@/pages/Homepage/ServicesSection";
export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Home" />

            <Navbar auth={auth} />
            <Hero />
            <ProductsGrid/>
            <ServicesSection />
            <Footer />
        </>
    );
}
