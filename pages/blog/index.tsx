import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Accordion, AccordionItem } from "@heroui/accordion";
import ReactMarkdown from "react-markdown";

import { BLOG_POSTS } from "../../utils/posts";

import DefaultLayout from "@/layouts/default";

/**
 * The main blog page.
 * It reads the BLOG_POSTS array and renders an Accordion.
 * To add a new post, you only need to edit `utils/blogPosts.ts`.
 */
export default function BlogPage() {
  function formatText(text: string) {
    // 1. Clean up outer quotes (if they exist from the mock data)
    const cleanText = text.replace(/^"|"$/g, "");

    return cleanText.replaceAll("\n\n", "\n\n&nbsp;\n\n");
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-4 p-4 md:p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Nok&apos;s Notes
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Your #1 source for all things Trollball.
        </p>

        <Accordion
          className="w-full max-w-4xl mt-4"
          defaultExpandedKeys={[BLOG_POSTS[0]?.id]} // Automatically expand the newest post
        >
          {BLOG_POSTS.map((post) => (
            <AccordionItem
              key={post.id}
              aria-label={post.title}
              subtitle={`Posted by ${post.author} on ${post.date}`}
              title={
                <span className="text-xl font-semibold">{post.title}</span>
              }
            >
              <Card>
                <CardBody>
                  {/* The 'prose' class from @tailwindcss/typography is perfect 
                  for styling markdown output automatically.
                */}
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{formatText(post.content)}</ReactMarkdown>
                  </div>
                </CardBody>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </DefaultLayout>
  );
}
