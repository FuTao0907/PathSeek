// 基础组件导出
export type { LoadingProps } from '@/shared/types';
export { default as Loading } from './Loading';

// 错误边界组件导出
export { default as ErrorBoundary } from './ErrorBoundary';
export {
  SafeComponent,
  useAsyncError,
  useErrorHandler,
  withErrorBoundary,
} from './ErrorBoundaryUtils';

// 通知组件导出
export { default as Notification } from './Notification';
export type {
  NotificationAction,
  NotificationItem,
  NotificationPosition,
  NotificationType,
} from './Notification';
export { default as NotificationContainer } from './NotificationContainer';

// 模态框组件导出
export { default as Modal } from './Modal';
export type { ModalProps, ModalSize } from './Modal';

// 表单组件导出
export { Form } from './Form';
export type { FormProps } from './Form';

// 按钮组件导出
export { Button, ButtonGroup, IconButton } from './Button';
export type {
  ButtonGroupProps,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  IconButtonProps,
} from './Button';

// 卡片组件导出
export {
  Card,
  CardContent,
  CardDivider,
  CardFooter,
  CardGrid,
  CardHeader,
  CardMedia,
} from './Card';
export type {
  BaseCardProps,
  CardContentProps,
  CardDividerProps,
  CardFooterProps,
  CardGridProps,
  CardHeaderProps,
  CardMediaProps,
  CardSize,
  CardVariant,
} from './Card';

// 布局组件导出
export {
  Container,
  Flex,
  Grid,
  GridItem,
  default as Layout,
  Spacer,
} from './Layout';
export type {
  ContainerProps,
  FlexProps,
  GridItemProps,
  GridProps,
  SpacerProps,
} from './Layout';

// 表单子组件导出
export { Checkbox, RadioGroup, Select, TextInput, Textarea } from './Form';
export type {
  BaseInputProps,
  CheckboxProps,
  RadioGroupProps,
  RadioOption,
  SelectOption,
  SelectProps,
  TextInputProps,
  TextareaProps,
} from './Form';

// 确认模态框组件导出
export { ConfirmModal } from './Modal';

// 浮动按钮组件导出
export { default as FloatingButton } from './FloatingButton';
export type { FloatingButtonProps } from './FloatingButton';
// 导入所有组件以便在默认导出中使用
import { Button, ButtonGroup, IconButton } from './Button';
import {
  Card,
  CardContent,
  CardDivider,
  CardFooter,
  CardGrid,
  CardHeader,
  CardMedia,
} from './Card';
import ErrorBoundary from './ErrorBoundary';
import {
  SafeComponent,
  useAsyncError,
  useErrorHandler,
  withErrorBoundary,
} from './ErrorBoundaryUtils';
import FloatingButton from './FloatingButton';
import {
  Checkbox,
  Form,
  RadioGroup,
  Select,
  TextInput,
  Textarea,
} from './Form';
import { Container, Flex, Grid, GridItem, Spacer } from './Layout';
import Loading from './Loading';
import { ConfirmModal, Modal } from './Modal';
import Notification from './Notification';
import NotificationContainer from './NotificationContainer';

// 默认导出所有组件
export default {
  // 基础组件
  Loading,

  // 错误边界
  ErrorBoundary,
  withErrorBoundary,
  useErrorHandler,
  useAsyncError,
  SafeComponent,

  // 通知
  Notification,
  NotificationContainer,

  // 模态框
  Modal,
  ConfirmModal,

  // 表单
  Form,
  TextInput,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,

  // 按钮
  Button,
  IconButton,
  ButtonGroup,
  FloatingButton,

  // 卡片
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardMedia,
  CardDivider,
  CardGrid,

  // 布局
  Container,
  Grid,
  GridItem,
  Flex,
  Spacer,
};
