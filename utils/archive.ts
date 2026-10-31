import { differenceInCalendarMonths, format, intervalToDuration } from 'date-fns';
import { ProductType, ProductWithSlug } from '../types/Product';

export type StatusFilter = 'all' | 'retired' | 'scheduled';
export type SortOption = 'recent' | 'oldest' | 'newest-launch' | 'shortest' | 'longest' | 'alpha';
export type ViewMode = 'cards' | 'timeline';

const today = new Date();

export const toDate = (value: string | null | undefined): Date => {
  if (!value || typeof value !== 'string') return new Date(NaN);
  return new Date(`${value}T00:00:00Z`);
};

const validDate = (date: Date) => !Number.isNaN(date.getTime());

export const isScheduled = (item: ProductWithSlug, now: Date = today) => toDate(item.dateClose).getTime() > now.getTime();

export const getStatus = (item: ProductWithSlug, now?: Date) => isScheduled(item, now) ? 'scheduled' : 'retired';

export const formatDate = (value: string | null | undefined) => {
  const date = toDate(value);
  return validDate(date) ? format(date, 'MMMM d, yyyy') : 'Unknown';
};

export const formatMonthYear = (value: string | null | undefined) => {
  const date = toDate(value);
  return validDate(date) ? format(date, 'MMMM yyyy') : 'Unknown';
};

export const lifespanMonths = (item: Pick<ProductWithSlug, 'dateOpen' | 'dateClose'>): number => {
  const start = toDate(item.dateOpen);
  const end = toDate(item.dateClose);
  if (!validDate(start) || !validDate(end)) return NaN;
  return Math.max(0, differenceInCalendarMonths(end, start));
};

export const formatLifespan = (item: Pick<ProductWithSlug, 'dateOpen' | 'dateClose'>) => {
  const start = toDate(item.dateOpen);
  const end = toDate(item.dateClose);
  if (!validDate(start) || !validDate(end)) return 'Unknown';
  const duration = intervalToDuration({ start, end });
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
    case 'newest-launch': return (validDate(toDate(b.dateOpen)) ? toDate(b.dateOpen).getTime() : -Infinity) - (validDate(toDate(a.dateOpen)) ? toDate(a.dateOpen).getTime() : -Infinity);
    case 'shortest': return (Number.isFinite(lifespanMonths(a)) ? lifespanMonths(a) : Infinity) - (Number.isFinite(lifespanMonths(b)) ? lifespanMonths(b) : Infinity);
    case 'longest': return (Number.isFinite(lifespanMonths(b)) ? lifespanMonths(b) : -Infinity) - (Number.isFinite(lifespanMonths(a)) ? lifespanMonths(a) : -Infinity);
    case 'alpha': return a.name.localeCompare(b.name);
    case 'recent':
    default: return toDate(b.dateClose).getTime() - toDate(a.dateClose).getTime();
  }
});

export const getArchiveStats = (items: ProductWithSlug[]) => {
  const lifespans = items.map(lifespanMonths).filter(Number.isFinite).sort((a, b) => a - b);
  const middle = Math.floor(lifespans.length / 2);
  const medianMonths = !lifespans.length ? 0 : lifespans.length % 2 ? lifespans[middle] : Math.round((lifespans[middle - 1] + lifespans[middle]) / 2);
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
