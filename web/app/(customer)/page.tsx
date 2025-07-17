import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Welcome to Our Restaurant
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
          Explore our delicious menu and place your order online.
          We offer a wide variety of dishes prepared with the freshest ingredients.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/menu">
            <Button size="lg" className="gap-2">
              View Menu <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-24 grid gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
              <path d="M7 7h.01" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-bold">Quality Ingredients</h3>
          <p className="mt-2 text-muted-foreground">
            We use only the freshest and highest quality ingredients in all our dishes.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
              <circle cx="17" cy="7" r="5" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-bold">Fast Service</h3>
          <p className="mt-2 text-muted-foreground">
            Quick and efficient service without compromising on quality.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-bold">Made with Love</h3>
          <p className="mt-2 text-muted-foreground">
            Every dish is prepared with care and attention to detail.
          </p>
        </div>
      </div>
    </div>
  );
}
