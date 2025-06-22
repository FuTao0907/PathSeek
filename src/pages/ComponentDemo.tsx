import React, { useState } from 'react';
import {
  Container,
  Grid,
  GridItem,
  Flex,
  Spacer,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  IconButton,
  ButtonGroup,
  TextInput,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Form,
  Modal,
  ConfirmModal,
  Notification,
  Loading,
} from '../shared';

// 示例图标组件
const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M12 5v14m-7-7h14" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const ComponentDemo: React.FC = () => {
  // 状态管理
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: '',
    newsletter: false,
    gender: '',
  });
  
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);

  // 表单处理
  const handleInputChange = (field: string) => (value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowNotification(true);
    }, 2000);
  };

  const selectOptions = [
    { value: 'general', label: '一般咨询' },
    { value: 'support', label: '技术支持' },
    { value: 'sales', label: '销售咨询' },
    { value: 'feedback', label: '意见反馈' },
  ];

  const radioOptions = [
    { value: 'male', label: '男' },
    { value: 'female', label: '女' },
    { value: 'other', label: '其他' },
  ];

  return (
    <Container maxWidth="2xl" padding="lg">
      <div style={{ padding: '2rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
          组件库演示
        </h1>
        
        {/* 布局组件演示 */}
        <Card variant="outlined" className="mb-8">
          <CardHeader title="布局组件" subtitle="容器、网格、弹性布局等" />
          <CardContent>
            <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>网格布局</h3>
            <Grid columns={3} gap="md">
              <GridItem>
                <Card variant="filled" size="sm">
                  <CardContent>网格项 1</CardContent>
                </Card>
              </GridItem>
              <GridItem>
                <Card variant="filled" size="sm">
                  <CardContent>网格项 2</CardContent>
                </Card>
              </GridItem>
              <GridItem>
                <Card variant="filled" size="sm">
                  <CardContent>网格项 3</CardContent>
                </Card>
              </GridItem>
            </Grid>
            
            <Spacer size="lg" />
            
            <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>弹性布局</h3>
            <Flex justify="between" align="center" gap="md">
              <Card variant="filled" size="sm">
                <CardContent>左侧内容</CardContent>
              </Card>
              <Card variant="filled" size="sm">
                <CardContent>中间内容</CardContent>
              </Card>
              <Card variant="filled" size="sm">
                <CardContent>右侧内容</CardContent>
              </Card>
            </Flex>
          </CardContent>
        </Card>
        
        {/* 按钮组件演示 */}
        <Card variant="outlined" className="mb-8">
          <CardHeader title="按钮组件" subtitle="各种样式和状态的按钮" />
          <CardContent>
            <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>按钮变体</h3>
            <Flex gap="md" wrap="wrap">
              <Button variant="primary">主要按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="outline">轮廓按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
              <Button variant="danger">危险按钮</Button>
              <Button variant="success">成功按钮</Button>
              <Button variant="warning">警告按钮</Button>
            </Flex>
            
            <Spacer size="md" />
            
            <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>按钮尺寸</h3>
            <Flex gap="md" align="center">
              <Button size="xs">超小</Button>
              <Button size="sm">小</Button>
              <Button size="md">中等</Button>
              <Button size="lg">大</Button>
              <Button size="xl">超大</Button>
            </Flex>
            
            <Spacer size="md" />
            
            <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>带图标的按钮</h3>
            <Flex gap="md">
              <Button leftIcon={<PlusIcon />}>添加</Button>
              <Button rightIcon={<HeartIcon />} variant="outline">收藏</Button>
              <Button loading>加载中...</Button>
              <IconButton icon={<SettingsIcon />} aria-label="设置" />
            </Flex>
            
            <Spacer size="md" />
            
            <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>按钮组</h3>
            <ButtonGroup>
              <Button variant="outline">左</Button>
              <Button variant="outline">中</Button>
              <Button variant="outline">右</Button>
            </ButtonGroup>
          </CardContent>
        </Card>
        
        {/* 表单组件演示 */}
        <Card variant="outlined" className="mb-8">
          <CardHeader title="表单组件" subtitle="各种输入控件和表单元素" />
          <CardContent>
            <Form onSubmit={handleSubmit}>
              <Grid columns={2} gap="md">
                <GridItem>
                  <TextInput
                    label="姓名"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    placeholder="请输入您的姓名"
                    required
                  />
                </GridItem>
                <GridItem>
                  <TextInput
                    type="email"
                    label="邮箱"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    placeholder="请输入您的邮箱"
                    required
                  />
                </GridItem>
              </Grid>
              
              <Select
                label="咨询类别"
                value={formData.category}
                onChange={handleInputChange('category')}
                options={selectOptions}
                placeholder="请选择咨询类别"
                required
              />
              
              <RadioGroup
                label="性别"
                value={formData.gender}
                onChange={handleInputChange('gender')}
                options={radioOptions}
                name="gender"
                direction="horizontal"
              />
              
              <Textarea
                label="留言"
                value={formData.message}
                onChange={handleInputChange('message')}
                placeholder="请输入您的留言..."
                rows={4}
                required
              />
              
              <Checkbox
                checked={formData.newsletter}
                onChange={handleInputChange('newsletter')}
                label="订阅我们的新闻通讯"
              />
              
              <Flex justify="end" gap="md">
                <Button type="button" variant="outline" onClick={() => setFormData({
                  name: '',
                  email: '',
                  message: '',
                  category: '',
                  newsletter: false,
                  gender: '',
                })}>
                  重置
                </Button>
                <Button type="submit" loading={loading}>
                  提交
                </Button>
              </Flex>
            </Form>
          </CardContent>
        </Card>
        
        {/* 卡片组件演示 */}
        <Card variant="outlined" className="mb-8">
          <CardHeader title="卡片组件" subtitle="不同样式和布局的卡片" />
          <CardContent>
            <Grid columns={3} gap="md">
              <GridItem>
                <Card variant="default" hoverable>
                  <CardHeader title="默认卡片" subtitle="带悬停效果" />
                  <CardContent>
                    这是一个默认样式的卡片，具有悬停效果。
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">查看详情</Button>
                  </CardFooter>
                </Card>
              </GridItem>
              <GridItem>
                <Card variant="elevated">
                  <CardHeader title="阴影卡片" subtitle="带阴影效果" />
                  <CardContent>
                    这是一个带阴影效果的卡片。
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline">了解更多</Button>
                  </CardFooter>
                </Card>
              </GridItem>
              <GridItem>
                <Card variant="filled">
                  <CardHeader title="填充卡片" subtitle="背景填充样式" />
                  <CardContent>
                    这是一个背景填充样式的卡片。
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="ghost">操作</Button>
                  </CardFooter>
                </Card>
              </GridItem>
            </Grid>
          </CardContent>
        </Card>
        
        {/* 交互组件演示 */}
        <Card variant="outlined" className="mb-8">
          <CardHeader title="交互组件" subtitle="模态框、通知等交互元素" />
          <CardContent>
            <Flex gap="md" wrap="wrap">
              <Button onClick={() => setShowModal(true)}>打开模态框</Button>
              <Button onClick={() => setShowConfirmModal(true)} variant="outline">
                确认对话框
              </Button>
              <Button onClick={() => setShowNotification(true)} variant="success">
                显示通知
              </Button>
            </Flex>
            
            <Spacer size="md" />
            
            <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>加载状态</h3>
            <Card variant="filled" size="sm">
              <CardContent>
                <Flex align="center" gap="md">
                  <Loading size="small" />
                  <span>正在加载数据...</span>
                </Flex>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
      
      {/* 模态框 */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="示例模态框"
        size="medium"
      >
        <p>这是一个示例模态框的内容。您可以在这里放置任何内容。</p>
        <Spacer size="md" />
        <Flex justify="end" gap="md">
          <Button variant="outline" onClick={() => setShowModal(false)}>
            取消
          </Button>
          <Button onClick={() => setShowModal(false)}>确定</Button>
        </Flex>
      </Modal>
      
      {/* 确认对话框 */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          setShowNotification(true);
        }}
        title="确认操作"
        message="您确定要执行此操作吗？此操作无法撤销。"
        type="warning"
      />
      
      {/* 通知 */}
      {showNotification && (
        <Notification
          notification={{
            id: 'demo-notification',
            type: 'success',
            title: '操作成功',
            message: '您的操作已成功完成！',
            duration: 3000,
            timestamp: new Date()
          }}
          onClose={() => setShowNotification(false)}
          position="top-right"
        />
      )}
    </Container>
  );
};

export default ComponentDemo;