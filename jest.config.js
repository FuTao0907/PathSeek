module.exports = {
  // 测试环境
  testEnvironment: 'jsdom',
  
  // 模块路径映射
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/shared/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/src/shared/hooks/$1',
    '^@types/(.*)$': '<rootDir>/src/shared/types/$1'
  },
  
  // 测试文件匹配模式
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  
  // 忽略的文件和目录
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/build/'
  ],
  
  // 模块文件扩展名
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json'
  ],
  
  // 转换配置
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.css$': 'jest-transform-css',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': 'jest-transform-file'
  },
  
  // 模块转换忽略
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  
  // 设置文件
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts'
  ],
  
  // 覆盖率配置
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/setupTests.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**'
  ],
  
  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // 覆盖率报告格式
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  
  // 覆盖率输出目录
  coverageDirectory: 'coverage',
  
  // 清除模拟
  clearMocks: true,
  
  // 恢复模拟
  restoreMocks: true,
  
  // 详细输出
  verbose: true,
  
  // 错误时退出
  bail: false,
  
  // 最大工作进程数
  maxWorkers: '50%',
  
  // 测试超时时间（毫秒）
  testTimeout: 10000,
  
  // 全局变量
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  
  // 模拟模块
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  
  // 监视插件
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};