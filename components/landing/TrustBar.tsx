'use client';

export default function TrustBar() {
  const items = [
    'Built for ADHD brains',
    'Executive dysfunction friendly',
    'No judgment. No pressure.',
    'Infinite task breakdown',
    'Powered by Groq & Llama 3.3',
    'One step at a time',
    'For the overwhelmed & burnt out',
    'Gentle by design'
  ];

  return (
    <div className="w-full bg-white/2 border-y border-white/5 py-5 overflow-hidden flex items-center">
      <div className="flex w-max animate-[marquee_40s_linear_infinite]" aria-hidden="true">
        {/* Double the items to create a seamless loop */}
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="text-white/40 font-medium text-sm whitespace-nowrap">
              {item}
            </span>
            <span className="text-white/15 mx-12 text-lg leading-none mt-[-2px]">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
