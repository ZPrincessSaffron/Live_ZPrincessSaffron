import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import ProductShowcase from "@/components/home/ProductShowcase";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import SaffronMomentsSection from "@/components/home/SaffronMomentsSection";
import JourneySection from "@/components/home/JourneySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ProductShowcase />
      <SaffronMomentsSection />
      <WhyChooseUs />
      <JourneySection />
      <section className="h-32 lg:h-40" />

      
      <TestimonialsSection />
    </Layout>
  );
};

export default Index;
