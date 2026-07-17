import { differenceInCalendarMonths, format, intervalToDuration } from 'date-fns';
import { ProductType, ProductWithSlug } from '../types/Product';

export type StatusFilter = 'all' | 'retired' | 'scheduled';
export type SortOption = 'recent' | 'oldest' | 'newest-launch' | 'shortest' | 'longest' | 'alpha';
export type ViewMode = 'cards' | 'timeline';

const today = new Date();

export const toDate = (value: string) => new Date(`${value}T00:00:00Z`);

export const isScheduled = (item: ProductWithSlug, now: Date = today) => toDate(item.dateClose).getTime() > now.getTime();

export const getStatus = (item: ProductWithSlug, now?: Date) => isScheduled(item, now) ? 'scheduled' : 'retired';

export const formatDate = (value: string) => format(toDate(value), 'MMMM d, yyyy');

export const formatMonthYear = (value: string) => format(toDate(value), 'MMMM yyyy');

export const lifespanMonths = (item: Pick<ProductWithSlug, 'dateOpen' | 'dateClose'>) =>
  Math.max(0, differenceInCalendarMonths(toDate(item.dateClose), toDate(item.dateOpen)));

export const formatLifespan = (item: Pick<ProductWithSlug, 'dateOpen' | 'dateClose'>) => {
  const duration = intervalToDuration({ start: toDate(item.dateOpen), end: toDate(item.dateClose) });
  const parts: string[] = [];
  if (duration.years) parts.push(`${duration.years} ${duration.years === 1 ? 'year' : 'years'}`);
  if (duration.months) parts.push(`${duration.months} ${duration.months === 1 ? 'month' : 'months'}`);
  if (!parts.length && duration.days) parts.push(`${duration.days} ${duration.days === 1 ? 'day' : 'days'}`);
  return parts.length ? parts.join(', ') : 'Less than a month';
};

export const filterArchive = (items: ProductWithSlug[], query: string, type: ProductType | 'all', status: StatusFilter) => {
  const term = query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesQuery = !term || item.name.toLowerCase().includes(term) || item.description.toLowerCase().includes(term);
    const matchesType = type === 'all' || item.type === type;
    const matchesStatus = status === 'all' || getStatus(item) === status;
    return matchesQuery && matchesType && matchesStatus;
  });
};

export const sortArchive = (items: ProductWithSlug[], sort: SortOption) => [...items].sort((a, b) => {
  switch (sort) {
    case 'oldest': return toDate(a.dateClose).getTime() - toDate(b.dateClose).getTime();
    case 'newest-launch': return toDate(b.dateOpen).getTime() - toDate(a.dateOpen).getTime();
    case 'shortest': return lifespanMonths(a) - lifespanMonths(b);
    case 'longest': return lifespanMonths(b) - lifespanMonths(a);
    case 'alpha': return a.name.localeCompare(b.name);
    case 'recent':
    default: return toDate(b.dateClose).getTime() - toDate(a.dateClose).getTime();
  }
});

export const getArchiveStats = (items: ProductWithSlug[]) => {
  const lifespans = items.map(lifespanMonths).sort((a, b) => a - b);
  const middle = Math.floor(lifespans.length / 2);
  const medianMonths = lifespans.length % 2 ? lifespans[middle] : Math.round((lifespans[middle - 1] + lifespans[middle]) / 2);
  const latest = sortArchive(items, 'recent')[0];
  return {
    total: items.length,
    retired: items.filter((item) => !isScheduled(item)).length,
    scheduled: items.filter((item) => isScheduled(item)).length,
    models: items.filter((item) => item.type === ProductType.MODEL).length,
    medianMonths,
    medianLabel: `${Math.floor(medianMonths / 12)}.${Math.round((medianMonths % 12) / 12 * 10)} years`,
    medianReadable: `${Math.floor(medianMonths / 12)} years${medianMonths % 12 ? `, ${medianMonths % 12} months` : ''}`,
    latest,
    lastUpdated: latest ? formatMonthYear(latest.dateClose) : '',
  };
};

export const groupByCloseYear = (items: ProductWithSlug[]) => items.reduce<Record<string, ProductWithSlug[]>>((groups, item) => {
  const year = toDate(item.dateClose).getUTCFullYear().toString();
  groups[year] = [...(groups[year] || []), item];
  return groups;
}, {});
