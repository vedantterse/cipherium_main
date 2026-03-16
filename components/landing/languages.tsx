import { SUPPORTED_LANGUAGES } from "@/lib/constants";

export function Languages() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-foreground mb-4">
            Supported Languages
          </h2>
          <p className="font-mono text-lg text-muted-foreground max-w-2xl mx-auto">
            Protecting users across India with support for major regional
            languages.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              className="px-6 py-4 bg-card border-[3px] border-card-border rounded-[4px] shadow-[4px_4px_0_theme(colors.cyber-green)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_theme(colors.cyber-green)] transition-all"
            >
              <p className="font-mono text-2xl text-cyber-green mb-1">
                {lang.native}
              </p>
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                {lang.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
