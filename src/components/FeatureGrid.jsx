import React from 'react';
import { Mic2, SpellCheck, BookMarked, BarChart2 } from 'lucide-react';

const features = [
  {
    icon: Mic2,
    title: 'Tone matching for every audience',
    description: 'Set your brand\'s tone — professional, playful, authoritative — and Accurrate AI ensures every piece hits that mark, every time.',
  },
  {
    icon: SpellCheck,
    title: 'Context-aware grammar correction',
    description: 'Goes beyond spell-check. Our AI understands your sentence intent and corrects grammar in context, preserving your natural voice.',
  },
  {
    icon: BookMarked,
    title: 'Brand voice consistency at scale',
    description: 'Upload your brand guidelines once. Accurrate AI enforces them across every blog post, email, ad, and social caption your team creates.',
  },
  {
    icon: BarChart2,
    title: 'SEO & readability scoring',
    description: 'Every polish pass includes a live readability grade and SEO signal report, so your content ranks as well as it reads.',
  },
];

const FeatureGrid = () => {
  return (
    <section className="bg-sand-10 py-24 px-6 lg:px-12">
      <div className="max-w-[630px] mx-auto text-center mb-16">
        <p className="text-[12px] uppercase text-sand-60 font-mono tracking-widest mb-4">
          Why Accurrate AI
        </p>
        <h4 className="mb-4">AI that actually polishes</h4>
        <p className="text-[18px] text-sand-70">
          Generic AI writes mediocre content. Accurrate AI refines it into something your brand is proud to publish.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={i}
              className="bg-white p-6 rounded-lg border border-sand-30 flex flex-col gap-4"
            >
              <div className="w-12 h-12 bg-sand-10 rounded flex items-center justify-center mb-2">
                <IconComponent className="text-sand-70 w-6 h-6" />
              </div>
              <p className="text-[20px] font-sans font-medium leading-tight">
                {feature.title}
              </p>
              <p className="text-body text-sand-70">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureGrid;
