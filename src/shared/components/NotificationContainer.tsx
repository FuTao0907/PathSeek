import React from 'react';
import { createPortal } from 'react-dom';
import Notification, {
  NotificationItem,
  NotificationPosition,
} from './Notification';
import styles from '../../styles/NotificationContainer.module.css';

// 通知容器属性
interface NotificationContainerProps {
  notifications: NotificationItem[];
  onRemove: (id: string) => void;
  position?: NotificationPosition;
  maxNotifications?: number;
  showProgress?: boolean;
  className?: string;
}

// 通知容器组件
const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemove,
  position = 'top-right',
  maxNotifications = 5,
  showProgress = true,
  className,
}) => {
  // 限制显示的通知数量
  const visibleNotifications = notifications.slice(0, maxNotifications);

  // 获取容器位置类名
  const getContainerClass = () => {
    const positionClassMap = {
      'top-left': styles.notificationContainerTopLeft,
      'top-right': styles.notificationContainerTopRight,
      'top-center': styles.notificationContainerTopCenter,
      'bottom-left': styles.notificationContainerBottomLeft,
      'bottom-right': styles.notificationContainerBottomRight,
      'bottom-center': styles.notificationContainerBottomCenter,
    };

    const positionClass =
      positionClassMap[position] || styles.notificationContainerTopRight;
    return `${styles.notificationContainer} ${positionClass} ${className || ''}`;
  };

  // 如果没有通知，不渲染容器
  if (visibleNotifications.length === 0) {
    return null;
  }

  const containerElement = (
    <div className={getContainerClass()}>
      {visibleNotifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={onRemove}
          position={position}
          showProgress={showProgress}
        />
      ))}
    </div>
  );

  // 使用 Portal 渲染到 body
  return createPortal(containerElement, document.body);
};

export default NotificationContainer;
