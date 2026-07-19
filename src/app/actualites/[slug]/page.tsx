import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, User, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { POSTS, getPost, formatDate } from "@/lib/posts";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Article introuvable" };
  return { title: post.title, description: post.excerpt };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <PageHeader
        title={post.title}
        crumbs={[{ label: "Actualités", href: "/actualites" }, { label: post.category }]}
      />

      <article className="container-cs section max-w-3xl">
        <div className="flex flex-wrap items-center gap-4 text-xs text-navy-600">
          <span className="badge bg-brand-blue/10 text-brand-blue">{post.category}</span>
          <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {formatDate(post.date)}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.readMinutes} min de lecture</span>
          <span className="flex items-center gap-1"><User className="h-4 w-4" /> {post.author}</span>
        </div>

        <div className="prose mt-8 max-w-none">
          {post.content.map((p, i) => (
            <p key={i} className="mb-4 text-[15px] leading-relaxed text-navy-600">{p}</p>
          ))}
        </div>

        <Link href="/actualites" className="btn-ghost mt-10">
          <ArrowLeft className="h-4 w-4" /> Retour aux actualités
        </Link>
      </article>
    </>
  );
}
