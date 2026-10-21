import styles from './WorkspaceFrame.module.css';

export default function WorkspaceFrame({ children }: { children: React.ReactNode }) {
  return <div className={styles.workspace}>{children}</div>;
}
