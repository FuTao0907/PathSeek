import React, { useEffect, useState, useCallback } from 'react';
import styles from '../../styles/Notification.module.css';

// 通知类型
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// 通知位置
export type NotificationPosition =
  | 'top-left'
  | 'top-right'
  | 'top-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center';

// 通知项接口
export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
  actions?: NotificationAction[];
  persistent?: boolean;
  icon?: React.ReactNode;
}

// 通知动作接口
export interface NotificationAction {
  label: string;
  onClick: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

// 通知组件属性
interface NotificationProps {
  notification: NotificationItem;
  onClose: (id: string) => void;
  position: NotificationPosition;
  showProgress?: boolean;
}

// 单个通知组件
const Notification: React.FC<NotificationProps> = ({
  notification,
  onClose,
  position,
  showProgress = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(100);

  const duration = notification.duration || 5000;
  const isPersistent = notification.persistent || false;

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300); // 等待退场动画完成
  }, [onClose, notification.id]);

  useEffect(() => {
    // 入场动画
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    // 自动关闭逻辑
    let progressTimer: NodeJS.Timeout;
    let closeTimer: NodeJS.Timeout;

    if (!isPersistent && duration > 0) {
      const startTime = Date.now();

      progressTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        setProgress((remaining / duration) * 100);

        if (remaining <= 0) {
          clearInterval(progressTimer);
        }
      }, 50);

      closeTimer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(showTimer);
      clearInterval(progressTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, isPersistent, handleClose]);

  const getIcon = () => {
    if (notification.icon) {
      return notification.icon;
    }

    switch (notification.type) {
      case 'success':
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
          </svg>
        );
      case 'error':
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      case 'warning':
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'info':
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeClass = () => {
    switch (notification.type) {
      case 'success':
        return styles.notificationSuccess;
      case 'error':
        return styles.notificationError;
      case 'warning':
        return styles.notificationWarning;
      case 'info':
        return styles.notificationInfo;
      default:
        return styles.notificationInfo;
    }
  };

  const getPositionClass = () => {
    switch (position) {
      case 'top-left':
        return styles.notificationTopLeft;
      case 'top-right':
        return styles.notificationTopRight;
      case 'top-center':
        return styles.notificationTopCenter;
      case 'bottom-left':
        return styles.notificationBottomLeft;
      case 'bottom-right':
        return styles.notificationBottomRight;
      case 'bottom-center':
        return styles.notificationBottomCenter;
      default:
        return styles.notificationTopRight;
    }
  };

  return (
    <div
      className={`
        ${styles.notification}
        ${getTypeClass()}
        ${getPositionClass()}
        ${isVisible ? styles.notificationVisible : ''}
        ${isLeaving ? styles.notificationLeaving : ''}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.notificationContent}>
        <div className={styles.notificationHeader}>
          <div className={styles.notificationIcon}>{getIcon()}</div>
          <div className={styles.notificationText}>
            <div className={styles.notificationTitle}>{notification.title}</div>
            <div className={styles.notificationMessage}>
              {notification.message}
            </div>
          </div>
          <button
            className={styles.notificationClose}
            onClick={handleClose}
            aria-label="关闭通知"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {notification.actions && notification.actions.length > 0 && (
          <div className={styles.notificationActions}>
            {notification.actions.map((action, index) => {
              const actionStyle = action.style || 'secondary';
              const actionClass =
                actionStyle === 'primary'
                  ? styles.notificationActionPrimary
                  : actionStyle === 'danger'
                    ? styles.notificationActionDanger
                    : styles.notificationActionSecondary;
              return (
                <button
                  key={index}
                  className={`${styles.notificationAction} ${actionClass}`}
                  onClick={() => {
                    action.onClick();
                    handleClose();
                  }}
                >
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showProgress && !isPersistent && duration > 0 && (
        <div className={styles.notificationProgress}>
          <div
            className={styles.notificationProgressBar}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Notification;
