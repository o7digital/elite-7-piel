import BlogDetails from "@/components/blogs/BlogDetails";
import Footer1 from "@/components/footers/Footer1";

import Header1 from "@/components/headers/Header1";
import { allBlogs } from "@/data/blogs";
import { getBlogMetadata } from "@/lib/seo/blogContent";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata(props) {
  const params = await props.params;
  const id = Number(params.id);
  const blog = allBlogs.find((elm) => elm.id === id);

  if (!blog) {
    return {
      title: "Articulo no encontrado",
      description:
        "El articulo solicitado no esta disponible en este momento dentro del blog de ELITE 7 PIEL.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const metadata = getBlogMetadata(blog);

  return {
    ...metadata,
    alternates: {
      canonical: `/blog_single/${blog.id}`,
    },
  };
}

export default async function BlogDetailsPage(props) {
  const params = await props.params;
  const id = Number(params.id);
  const blog = allBlogs.find((elm) => elm.id === id);

  if (!blog) {
    notFound();
  }

  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <BlogDetails blog={blog} />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer1 />
    </>
  );
}
