import HomePage15 from "./(homes)/home-15/page";
import { homeSeoMetadata } from "@/data/seoKeywordContent";

export const metadata = homeSeoMetadata;
export const revalidate = 300;
export default function Home() {
  return (
    <>
      <HomePage15 />
    </>
  );
}
