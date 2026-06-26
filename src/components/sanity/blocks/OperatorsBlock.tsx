type OperatorsBlockData = {
  _key?: string;
  _type?: string;
  eyebrow?: string;
  heading?: string;
  operators?: string[];
  note?: string;
};

export function OperatorsBlock({ block }: { block: OperatorsBlockData }) {
  const operators = block.operators ?? [];

  if (!block.heading || !operators.length) {
    return null;
  }

  return (
    <section className="py-14">
      <div className="container">
        <div className="mx-auto max-w-[880px]">
          {block.eyebrow ? (
            <p className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-rr-green">
              <span className="h-px w-6 bg-rr-green" />
              {block.eyebrow}
            </p>
          ) : null}

          <h2 className="max-w-[680px] text-3xl font-medium leading-tight tracking-[-0.03em] text-rr-primary">
            {block.heading}
          </h2>

          <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {operators.map((operator, index) => (
              <div
                key={`${operator}-${index}`}
                className="rounded-lg border border-rr-border bg-rr-surface px-4 py-4 text-center text-sm font-medium text-rr-primary"
              >
                {operator}
              </div>
            ))}
          </div>

          {block.note ? <p className="mt-5 text-sm text-rr-muted">{block.note}</p> : null}
        </div>
      </div>
    </section>
  );
}
