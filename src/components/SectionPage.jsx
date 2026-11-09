import { useState } from 'react';
import CodeBlock from './CodeBlock';

export default function SectionPage({ icon, title, description, snippets }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="code-section">
      <div className="section-header">
        <span className="section-badge">{icon}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="tabs">
        {snippets.map((s, i) => (
          <button
            key={i}
            className={`tab ${i === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {s.tabLabel}
          </button>
        ))}
      </div>

      <CodeBlock
        language={snippets[activeTab].language}
        badge={snippets[activeTab].badge}
        code={snippets[activeTab].code}
      />
    </section>
  );
}
