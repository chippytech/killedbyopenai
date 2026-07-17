import { FC, useMemo, useState } from 'react';
import { ProductType, ProductWithSlug } from 'types/Product';
import { filterArchive, formatDate, formatLifespan, getArchiveStats, getStatus, groupByCloseYear, isScheduled, SortOption, sortArchive, StatusFilter, ViewMode } from 'utils/archive';

const repo = 'https://github.com/chippytech/killedbyopenai';
const issue = `${repo}/issues/new/choose`;
const contributing = `${repo}#contributing`;

const App: FC<{ items: ProductWithSlug[] }> = ({ items }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<ProductType | 'all'>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortOption>('recent');
  const [view, setView] = useState<ViewMode>('cards');
  const stats = useMemo(() => getArchiveStats(items), [items]);
  const visible = useMemo(() => sortArchive(filterArchive(items, query, type, status), sort), [items, query, type, status, sort]);
  const active = query || type !== 'all' || status !== 'all';
  const clear = () => { setQuery(''); setType('all'); setStatus('all'); };
  return <main>
    <section className="page-shell hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">An independent product archive</p>
        <h1 id="hero-title">Some products disappear.<br />Their history should not.</h1>
        <p className="hero-lede">Killed by OpenAI documents products, models, APIs, services, and features that OpenAI has retired, replaced, or scheduled for retirement.</p>
        <div className="action-row"><a className="button primary" href="#archive">Browse the archive</a><a className="button secondary" href={issue}>Submit an entry</a></div>
      </div>
      <aside className="index-card" aria-label="Archive index">
        <p className="eyebrow">Archive index</p><strong>{stats.total} recorded retirements</strong>
        <dl><div><dt>Latest entry</dt><dd>{stats.latest?.name}</dd></div><div><dt>Median lifespan</dt><dd>{stats.medianReadable}</dd></div><div><dt>Last updated</dt><dd>{stats.lastUpdated}</dd></div></dl>
        <p className="muted">Maintained by the community.</p>
      </aside>
    </section>
    <section className="page-shell stats-strip" aria-label="Archive statistics"><Stat value={stats.retired.toString()} label="Retired entries" /><Stat value={stats.models.toString()} label="Models archived" /><Stat value={stats.medianLabel} label="Median lifespan" /></section>
    <section id="archive" className="page-shell archive-section" aria-labelledby="archive-title">
      <div className="section-heading"><h2 id="archive-title">The archive</h2><p>Browse discontinued and scheduled-for-retirement products by name, category, date, or lifespan.</p></div>
      <div className="controls" aria-label="Archive controls">
        <div className="controls-top"><label className="search"><span>Search archive</span><i aria-hidden="true">⌕</i><input id="searchBox" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, models, and descriptions" /></label><label className="select-label">Sort<select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}><option value="recent">Most recently retired</option><option value="oldest">Oldest retirement</option><option value="newest-launch">Newest launch</option><option value="shortest">Shortest lifespan</option><option value="longest">Longest lifespan</option><option value="alpha">Alphabetical</option></select></label><ViewToggle view={view} setView={setView} /></div>
        <div className="controls-bottom"><ChipGroup label="Category" options={[['all','All'],[ProductType.MODEL,'Models'],[ProductType.SERVICE,'Services']]} value={type} onChange={(v) => setType(v as ProductType | 'all')} /><ChipGroup label="Status" options={[['all','All statuses'],['retired','Retired'],['scheduled','Scheduled']]} value={status} onChange={(v) => setStatus(v as StatusFilter)} /><p className="result-count">{query ? `${visible.length} ${visible.length === 1 ? 'result' : 'results'} for “${query}”` : `${visible.length} ${visible.length === 1 ? 'entry' : 'entries'}`}</p>{active && <button className="clear" onClick={clear}>Clear filters</button>}</div>
      </div>
      {visible.length === 0 ? <EmptyState clear={clear} /> : view === 'cards' ? <div className="archive-grid">{visible.map((item) => <ArchiveCard key={item.slug} item={item} />)}</div> : <ArchiveTimeline items={visible} />}
    </section>
    <InfoSections />
  </main>;
};
const Stat = ({ value, label }: { value: string; label: string }) => <div><strong>{value}</strong><span>{label}</span></div>;
const ChipGroup = ({ label, options, value, onChange }: { label: string; options: [string,string][]; value: string; onChange: (v:string)=>void }) => <fieldset className="chip-group"><legend>{label}</legend>{options.map(([v,l]) => <button key={v} type="button" aria-pressed={value===v} onClick={() => onChange(v)}>{l}</button>)}</fieldset>;
const ViewToggle = ({ view, setView }: { view: ViewMode; setView: (v:ViewMode)=>void }) => <div className="view-toggle" role="group" aria-label="View"><button type="button" aria-pressed={view==='cards'} onClick={() => setView('cards')}>Cards</button><button type="button" aria-pressed={view==='timeline'} onClick={() => setView('timeline')}>Timeline</button></div>;
const ArchiveCard = ({ item }: { item: ProductWithSlug }) => <article className="archive-card"><div className="card-meta"><span className="badge">{item.type}</span><span className={`status ${getStatus(item)}`}>{getStatus(item)}</span></div><h3>{item.name}</h3><p>{item.description}</p><dl className="dates"><div><dt>Launched</dt><dd>{formatDate(item.dateOpen)}</dd></div><div><dt>{isScheduled(item) ? 'Scheduled for retirement' : 'Retired'}</dt><dd>{formatDate(item.dateClose)}</dd></div><div><dt>{isScheduled(item) ? 'Expected lifespan' : 'Lifespan'}</dt><dd>{formatLifespan(item)}</dd></div></dl><a className="source" href={item.link} target="_blank" rel="noopener noreferrer">View source ↗</a></article>;
const ArchiveTimeline = ({ items }: { items: ProductWithSlug[] }) => { const groups = groupByCloseYear(items); return <div className="timeline">{Object.keys(groups).sort((a,b)=>Number(b)-Number(a)).map((year)=><section className="timeline-year" key={year}><h3>{year}</h3><div>{groups[year].map((item)=><article key={item.slug}><div><h4>{item.name}</h4><span className="badge">{item.type}</span> <span className={`status ${getStatus(item)}`}>{getStatus(item)}</span></div><p className="timeline-date">{isScheduled(item) ? 'Scheduled for retirement' : 'Retired'} {formatDate(item.dateClose)}</p><p>{item.description}</p><a href={item.link} target="_blank" rel="noopener noreferrer">View source ↗</a></article>)}</div></section>)}</div>; };
const EmptyState = ({ clear }: { clear: () => void }) => <div className="empty"><div aria-hidden="true" className="mini-mark" /><h3>Nothing found in the archive.</h3><p>Try another search term or clear the active filters.</p><button className="button primary" onClick={clear}>Clear filters</button></div>;
const InfoSections = () => <><section id="about" className="page-shell about"><div><h2>Why keep an archive?</h2><p>AI products evolve quickly. Names change, models are replaced, APIs are deprecated, and documentation disappears. This project preserves a simple public record of what existed, when it launched, and when it ended.</p><p>Killed by OpenAI is an independent community project. It is not affiliated with or endorsed by OpenAI.</p></div><ul><li>Document</li><li>Verify</li><li>Preserve</li></ul></section><section className="page-shell contribute"><h2>Something missing?</h2><p>Help keep the archive accurate by submitting a retirement, correcting a date, or improving a source.</p><div className="action-row"><a className="button primary" href={issue}>Submit an entry</a><a className="button secondary" href={contributing}>Read contribution guidelines</a></div></section></>;
export default App;
