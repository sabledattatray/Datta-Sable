import { CalendarDays, Clock } from 'lucide-react';
import { formatPostDate, formatReadTime } from '@/lib/post-metadata';
import styles from './PostMetadata.module.css';

type Props = {
  readTime?: number | string | null;
  date?: string | Date | null;
  updatedAt?: string | Date | null;
  author?: string;
};

export default function PostMetadata({ readTime, date, updatedAt, author }: Props) {
  const duration = formatReadTime(readTime);
  const published = formatPostDate(date);
  const updated = formatPostDate(updatedAt);
  if (!duration && !published && !updated && !author) return null;
  return <div className={styles.row} data-post-metadata>
    {duration && <span className={styles.item}><Clock size={14} aria-hidden="true" /><span>{duration}</span></span>}
    {published && <span className={styles.item}><CalendarDays size={14} aria-hidden="true" /><time dateTime={published.dateTime}>Published {published.label}</time></span>}
    {updated && updated.label !== published?.label && <span className={styles.item}><time dateTime={updated.dateTime}>Updated {updated.label}</time></span>}
    {author && <span className={styles.item}>By {author}</span>}
  </div>;
}
