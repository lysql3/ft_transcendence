import ReactMarkdown from "react-markdown";

type ChallengeDescriptionProps = { description: string };

export default function ChallengeDescription({
  description,
}: ChallengeDescriptionProps) {
  return (
    <div className="min-w-0 break-words [&>:first-child]:mt-0 [&>:last-child]:mb-0">
      <ReactMarkdown
        components={{
          // The problem title and statement region already own h1/h2.
          h1: ({ children }) => (
            <h3 className="mb-3 mt-6 text-lg font-bold tracking-ui text-accent">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h3 className="mb-3 mt-6 text-base font-bold tracking-ui text-accent">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 mt-6 text-base font-bold tracking-ui text-accent">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-3 text-sm leading-7 text-muted-foreground">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),
          code: ({ children }) => (
            <code className="rounded-ui bg-secondary px-1 py-0.5 text-accent">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-ui border border-border bg-background p-4 font-mono text-sm leading-6 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-foreground">
              {children}
            </pre>
          ),
          ul: ({ children }) => (
            <ul className="my-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground marker:text-accent">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-muted-foreground marker:text-accent">
              {children}
            </ol>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="rounded-ui text-accent underline underline-offset-4 hover:text-accent/80"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-accent bg-secondary/40 px-4 py-1">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-6 border-border" />,
        }}
      >
        {description}
      </ReactMarkdown>
    </div>
  );
}
