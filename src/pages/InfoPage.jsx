import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import { useSeo } from '@/hooks/useSeo';
import { infoPages } from '@/data/infoPages';

export default function InfoPage({ page }) {
  const content = infoPages[page];
  useSeo(content.seoTitle, content.seoDesc);

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <p className="section-subtitle">{content.subtitle}</p>
            <h1 className="section-title mt-3">{content.title}</h1>
            <div className="w-16 h-[1px] bg-gold-500 mt-6" />
          </motion.div>

          <div className="space-y-12">
            {content.sections.map((section, i) => (
              <motion.section
                key={section.heading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
              >
                <h2 className="font-serif text-2xl mb-4">{section.heading}</h2>
                {section.body?.map((p) => (
                  <p key={p} className="text-sm text-caviar-600 dark:text-caviar-300 leading-relaxed mb-4">{p}</p>
                ))}
                {section.table && (
                  <div className="overflow-x-auto mb-6 border border-caviar-200 dark:border-caviar-700">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-caviar-100 dark:bg-caviar-800">
                          {Object.keys(section.table[0]).map((k) => (
                            <th key={k} className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium">{k}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.map((row, ri) => (
                          <tr key={ri} className="border-t border-caviar-200 dark:border-caviar-700">
                            {Object.values(row).map((cell, ci) => (
                              <td key={ci} className="px-4 py-3 text-caviar-600 dark:text-caviar-300">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {section.items && (
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start space-x-3 text-sm text-caviar-600 dark:text-caviar-300 leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-gold-500 flex-shrink-0 mt-2 rounded-full" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.section>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}