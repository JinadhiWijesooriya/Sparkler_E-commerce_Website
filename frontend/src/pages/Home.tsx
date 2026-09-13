import HeroSection from "../components/HomeComponents/HeroSection";
import FeaturedCollections from "../components/HomeComponents/FeaturedCollections";
import WhySparkler from "../components/HomeComponents/WhySparkler";
import AdvertisementSection from "../components/HomeComponents/AdvertisementSection";
import PopularProducts from "../components/HomeComponents/PopularProducts";
import CustomJewelryCTA from "../components/HomeComponents/CustomJewelryCTA";
import BlogPreview from "../components/HomeComponents/BlogPreview";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedCollections />
      <WhySparkler />
      <AdvertisementSection />
      <PopularProducts />
      <CustomJewelryCTA />
      <BlogPreview />
    </>
  );
}
