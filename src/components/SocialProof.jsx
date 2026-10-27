import React from 'react';

const testimonials = [
  {
    name: 'Priya Mehta',
    title: 'Content Lead @ Brandify',
    stat: '4hrs',
    statDesc: 'saved per writer, per week',
    img: 'fox-jackson.0-sr3v31f4h22.png',
    quote: 'Accurrate AI cut our editing cycle in half. Our blog now goes live same-day instead of waiting for a manual review round.',
  },
  {
    name: 'James Calero',
    title: 'CMO @ Vantara Health',
    stat: '98%',
    statDesc: 'brand voice consistency score',
    img: 'gabrielle-klobucar.0qnakiya2c0~u.png',
    quote: 'Our tone was all over the place across channels. Now every piece of content sounds unmistakably like us.',
  },
  {
    name: 'Leila Osman',
    title: 'Founder @ Stellar Copy Agency',
    stat: '3X',
    statDesc: 'increase in client output volume',
    img: 'sasi-reddy.089hn3g_moxgh.png',
    quote: 'We onboarded Accurrate AI and tripled the content we deliver to clients without hiring a single new editor.',
  },
  {
    name: 'Tom Brickwell',
    title: 'Marketing Agency Founder @ Inkblot',
    stat: '0',
    statDesc: 'embarrassing typos published',
    img: 'abbey-yvon.12qoz8wtcw5i7.png',
    quote: 'We used to cringe every time a client spotted a typo. That anxiety is completely gone since switching to Accurrate AI.',
  },
];

const SocialProof = () => {
  return (
    <section id="social-proof" className="py-16 px-6 bg-sand-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <h5 className="text-[24px] font-medium mb-2 font-sans">
            The fastest-growing content teams trust Accurrate AI
          </h5>
          <p className="text-[16px] text-sand-60">
            Over 40,000 writers, marketers, and agencies polish their content with Accurrate AI every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-sand-30 shadow-sm flex flex-col justify-between"
            >
              <div>
                <p className="text-[32px] font-serif text-black mb-1 leading-none">
                  {card.stat}
                </p>
                <p className="text-[12px] text-sand-60 uppercase tracking-wide mb-4 font-mono">
                  {card.statDesc}
                </p>
                <p className="text-[16px] text-sand-80 mb-6 italic">
                  "{card.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-sand-30">
                <img
                  src={`https://www.apollo.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F${card.img}&w=384&q=75`}
                  className="w-12 h-12 rounded-full object-cover"
                  alt={card.name}
                />
                <div>
                  <p className="font-medium text-[14px] text-black">{card.name}</p>
                  <p className="text-[12px] text-sand-60 whitespace-pre-line">{card.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
