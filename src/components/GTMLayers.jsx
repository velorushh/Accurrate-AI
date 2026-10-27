import React from 'react';

const GTMLayers = () => {
  return (
    <section className="py-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
      <div className="text-center mb-16 max-w-[630px] mx-auto">
        <p className="text-[12px] uppercase text-sand-70 font-mono tracking-widest mb-4">
          How it works
        </p>
        <h4 className="mb-4">One workflow. Three stages.</h4>
        <p className="text-[18px] text-sand-70">
          Analyze your draft. Polish it to perfection. Publish with confidence. Every piece of content gets sharper each time.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
        {/* Analyze Layer */}
        <div className="flex flex-col gap-6">
          <img
            src="https://www.apollo.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftrusted-data.10oag~ztqp2a-.png&w=828&q=75"
            alt="Analyze Stage"
            className="w-full rounded-xl aspect-square object-cover"
          />
          <div>
            <h6 className="text-[32px] font-serif font-medium mb-3">
              Analyze drafts with deep content intelligence
            </h6>
            <p className="text-[16px] text-sand-80 mb-6">
              Accurrate AI scans your draft for tone mismatches, grammar issues, readability gaps, and brand voice deviations — all before you publish.
            </p>
            <a href="/features/analyze" className="btn btn-variant-1 w-fit">
              Explore the Analyze stage
            </a>
          </div>
        </div>

        {/* Polish Layer */}
        <div className="flex flex-col gap-6">
          <img
            src="https://www.apollo.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fai-busywork.0ws5ft2is7ov-.png&w=828&q=75"
            alt="Polish Stage"
            className="w-full rounded-xl aspect-square object-cover"
          />
          <div>
            <h6 className="text-[32px] font-serif font-medium mb-3">
              Let AI polish your content instantly
            </h6>
            <p className="text-[16px] text-sand-80 mb-6">
              Our AI rewrites, refines, and restructures your content — correcting tone, fixing grammar, and aligning every sentence with your brand guidelines.
            </p>
            <a href="/features/polish" className="btn btn-variant-1 w-fit">
              Explore the Polish stage
            </a>
          </div>
        </div>

        {/* Publish Layer */}
        <div className="flex flex-col gap-6">
          <img
            src="https://www.apollo.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsource-of-truth.0c.nui1qdm-rq.png&w=828&q=75"
            alt="Publish Stage"
            className="w-full rounded-xl aspect-square object-cover"
          />
          <div>
            <h6 className="text-[32px] font-serif font-medium mb-3">
              Publish with a single source of brand truth
            </h6>
            <p className="text-[16px] text-sand-80 mb-6">
              Export polished content directly to your CMS, email platform, or doc — so your whole team always publishes from the same brand-approved standard.
            </p>
            <a href="/features/publish" className="btn btn-variant-1 w-fit">
              Explore the Publish stage
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GTMLayers;
