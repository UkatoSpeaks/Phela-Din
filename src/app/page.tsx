import { ButtonLink } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-[80dvh] max-w-xl flex-col items-center justify-center gap-6 text-center">
      <p className="rounded-full bg-saffron/20 px-4 py-1 text-sm font-medium text-terracotta">पहला दिन</p>
      <h1 className="text-5xl font-extrabold tracking-tight">Pehla Din</h1>
      <p className="max-w-sm text-xl text-muted">Live the job before you choose it.</p>
      <ButtonLink href="/careers" className="mt-4 w-full max-w-xs">
        Browse careers
      </ButtonLink>
    </section>
  );
}
