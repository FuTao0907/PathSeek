import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '@/styles/Modal.css';

// 模态框尺寸
export type ModalSize = 'small' | 'medium' | 'large' | 'full';

// 模态框属性
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | undefined;
  children: React.ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  preventBodyScroll?: boolean;
  centered?: boolean;
  animation?: boolean;
  zIndex?: number;
}

// 模态框组件
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  overlayClassName,
  contentClassName,
  footer,
  header,
  preventBodyScroll = true,
  centered = true,
  animation = true,
  zIndex = 1000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // 处理模态框打开/关闭
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      if (preventBodyScroll) {
        document.body.style.overflow = 'hidden';
      }
      
      if (animation) {
        setIsAnimating(true);
        setTimeout(() => setIsVisible(true), 10);
      } else {
        setIsVisible(true);
      }
      
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
    } else {
      if (animation && isAnimating) {
        setIsVisible(false);
        setTimeout(() => {
          setIsAnimating(false);
          if (previousActiveElement.current) {
            previousActiveElement.current.focus();
          }
        }, 300);
      } else {
        setIsAnimating(false);
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }
      
      if (preventBodyScroll) {
        document.body.style.overflow = '';
      }
    }

    return () => {
      if (preventBodyScroll) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, animation, preventBodyScroll, isAnimating]);

  // 处理 ESC 键关闭
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // 处理点击遮罩关闭
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // 获取尺寸类名
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'modal-small';
      case 'medium': return 'modal-medium';
      case 'large': return 'modal-large';
      case 'full': return 'modal-full';
      default: return 'modal-medium';
    }
  };

  if (!isOpen && !isAnimating) {
    return null;
  }

  const modalElement = (
    <div
      className={`
        modal-overlay
        ${overlayClassName || ''}
        ${isVisible ? 'modal-overlay-visible' : ''}
        ${centered ? 'modal-overlay-centered' : ''}
      `}
      style={{ zIndex }}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={`
          modal-content
          ${getSizeClass()}
          ${contentClassName || ''}
          ${className || ''}
          ${isVisible ? 'modal-content-visible' : ''}
        `}
        tabIndex={-1}
      >
        {(title || header || showCloseButton) && (
          <div className="modal-header">
            {header || (
              <>
                {title && (
                  <h2 id="modal-title" className="modal-title">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    className="modal-close-button"
                    onClick={onClose}
                    aria-label="关闭模态框"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>
        )}

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalElement, document.body);
};

// 确认对话框组件
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string | undefined;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  type = 'info',
  loading = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff9800">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        );
      case 'danger':
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f44336">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        );
      default:
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2196f3">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || undefined}
      size="small"
      footer={
        <>
          <button className="cancel-button" onClick={onClose} disabled={loading}>
            {cancelText}
          </button>
          <button className="confirm-button" onClick={onConfirm} disabled={loading}>
            {loading ? '处理中...' : confirmText}
          </button>
        </>
      }
    >
      <div className="confirm-content">
        <div className="confirm-icon">{getIcon()}</div>
        <div className="confirm-message">{message}</div>
      </div>
    </Modal>
  );
};

export default Modal;
