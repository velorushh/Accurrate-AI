import React from 'react';

const badges = [
  {
    name: 'GDPR',
    src: 'https://www.apollo.io/_next/static/media/gdpr.0_pl3wx9g0ydy.svg',
  },
  {
    name: 'SOC 2',
    src: 'https://www.apollo.io/_next/static/media/soc-2.0qtn2ul6n~~yp.svg',
  },
  {
    name: 'CCPA',
    src: 'https://www.apollo.io/_next/static/media/ccpa.0~p.zito5pbls.svg',
  },
  {
    name: 'ISO/IEC 27001',
    src: 'https://www.apollo.io/_next/static/media/iso-iec.0u4yr~xms.7p1.svg',
  },
  {
    name: 'CASA Tier 2',
    src: 'https://www.apollo.io/_next/static/media/casa-tier-2.0y.zgoru-9wsl.svg',
  },
  {
    name: 'CPRA',
    src: 'https://www.apollo.io/_next/static/media/cpra.0-k~qdy4hbgx_.svg',
  },
  {
    name: 'EU-US DPF',
    src: 'https://www.apollo.io/_next/static/media/eu-us-dpf.10uka_7m.ma58.svg',
  },
  {
    name: 'PCI DSS',
    src: 'https://www.apollo.io/_next/static/media/pci-dss.0xx3jhfwxj5-..svg',
  },
];

const SecurityLogos = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <h4 className="text-center mb-16 max-w-[600px] mx-auto">
          Don’t change your workflow. Just add Apollo.
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 justify-items-center">
          {badges.map((badge, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-24 h-24 bg-sand-10 rounded-lg flex items-center justify-center p-4">
                <img
                  src={badge.src}
                  alt={badge.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[12px] font-mono uppercase text-sand-60 mt-3 text-center">
                {badge.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityLogos;
