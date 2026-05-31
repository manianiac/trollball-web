import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import { BLOG_POSTS } from "../../../shared/posts";
import DefaultLayout from "../../layouts/default";
import { formatText } from "../../../shared/utils";
import { MicrophoneIcon, BlogIcon } from "../../components/icons";

// ─── Config ────────────────────────────────────────────────────────────────
// Posts at index 0...(CURRENT_SEASON_COUNT-1) are "Current Season".
// Everything from CURRENT_SEASON_COUNT onward goes into "Past Seasons".
const CURRENT_SEASON_COUNT = 0;

// ─── Sub-components ────────────────────────────────────────────────────────

function PostCard({ post }: { post: (typeof BLOG_POSTS)[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="w-full bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden relative transition-all duration-300 hover:border-orange-500/30 hover:shadow-orange-500/5">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500/30 to-amber-500/30 transition-all duration-300 group-hover:from-orange-500 group-hover:to-amber-500" />

      {/* Header / toggle */}
      <button
        id={`post-toggle-${post.id}`}
        className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 cursor-pointer group"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`post-body-${post.id}`}
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-widest text-orange-600 dark:text-orange-400 font-bold mb-1.5 font-sans">
            {post.date} &mdash; {post.author}
          </p>
          <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-gray-100 font-sans leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors text-balance">
            {post.title}
          </h2>
        </div>
        <span
          className={`mt-1 shrink-0 text-gray-400 dark:text-gray-500 text-xl transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {/* Body */}
      {open && (
        <div
          id={`post-body-${post.id}`}
          className="px-6 pb-6 border-t border-gray-100 dark:border-gray-800/80 pt-5"
        >
          <div className="prose prose-sm md:prose dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-orange-600 dark:prose-a:text-orange-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100">
            <ReactMarkdown>{formatText(post.content)}</ReactMarkdown>
          </div>
        </div>
      )}
    </article>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function BlogPage() {
  const [pastOpen, setPastOpen] = useState(false);

  const currentPosts = BLOG_POSTS.slice(0, CURRENT_SEASON_COUNT);
  const pastPosts = BLOG_POSTS.slice(CURRENT_SEASON_COUNT);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-8 p-4 md:p-8 w-full">
        {/* Page header */}
        <div className="w-full max-w-4xl rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-2xl relative overflow-hidden p-8 md:p-10">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500" />
          <span className="text-xs uppercase tracking-widest text-orange-600 dark:text-orange-400 font-bold font-sans">
            <MicrophoneIcon size={28} className="text-orange-500" /> The
            Official Voice of Tuesday Night Trollball
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white font-sans uppercase mt-2">
            Nok&apos;s Notes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Your #1 source for all things Trollball — recaps, rants, and
            revelations from the demon announcer himself.
          </p>
        </div>

        {/* Current Season Posts */}
        <div className="w-full max-w-4xl flex flex-col gap-4">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 border-l-4 border-orange-500 pl-4 pb-1 font-sans">
            Current Season
          </h2>

          {currentPosts.length === 0 ? (
            <div className="w-full bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 text-center shadow-xl">
              <div className="bg-orange-50 dark:bg-orange-950/50 border border-orange-200/50 dark:border-orange-800/40 w-12 h-12 rounded-xl flex items-center justify-center p-2">
                <BlogIcon size={28} className="text-orange-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                No posts yet for this season — check back after the next match
                night!
              </p>
            </div>
          ) : (
            currentPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>

        {/* Past Seasons */}
        {pastPosts.length > 0 && (
          <div className="w-full max-w-4xl flex flex-col gap-4">
            {/* Toggle header */}
            <button
              id="past-seasons-toggle"
              className="flex items-center justify-between w-full text-left group cursor-pointer"
              onClick={() => setPastOpen((o) => !o)}
              aria-expanded={pastOpen}
              aria-controls="past-seasons-body"
            >
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 border-l-4 border-gray-300 dark:border-gray-700 pl-4 pb-1 font-sans group-hover:border-orange-500 transition-colors">
                Past Seasons
                <span className="ml-3 text-sm font-normal text-gray-400 dark:text-gray-500">
                  ({pastPosts.length} posts)
                </span>
              </h2>
              <span
                className={`text-gray-400 dark:text-gray-500 text-xl transition-transform duration-300 mr-1 ${pastOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>

            {pastOpen && (
              <div
                id="past-seasons-body"
                className="flex flex-col gap-4 animate-in fade-in duration-200"
              >
                {pastPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}
