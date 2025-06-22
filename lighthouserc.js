module.exports = {
  ci: {
    // 收集配置
    collect: {
      // 要测试的 URL
      url: [
        'http://localhost:3000',
        'http://localhost:3000/articles',
        'http://localhost:3000/about'
      ],
      // 启动服务器命令
      startServerCommand: 'npm run build && npx serve -s build -p 3000',
      // 启动服务器超时时间
      startServerReadyPattern: 'Local:',
      // 启动服务器超时时间（毫秒）
      startServerReadyTimeout: 30000,
      // 收集次数（取平均值）
      numberOfRuns: 3,
      // Chrome 设置
      settings: {
        // 禁用设备模拟
        emulatedFormFactor: 'desktop',
        // 禁用 CPU 节流
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        // 跳过某些审计
        skipAudits: [
          'canonical',
          'maskable-icon',
          'offline-start-url'
        ]
      }
    },
    
    // 断言配置
    assert: {
      // 性能预算
      assertions: {
        // 性能指标
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.8 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // 其他重要指标
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'interactive': ['error', { maxNumericValue: 5000 }],
        
        // 资源大小
        'total-byte-weight': ['error', { maxNumericValue: 1024000 }], // 1MB
        'unused-javascript': ['warn', { maxNumericValue: 20000 }],
        'unused-css-rules': ['warn', { maxNumericValue: 20000 }],
        
        // 图片优化
        'modern-image-formats': 'warn',
        'uses-optimized-images': 'warn',
        'uses-responsive-images': 'warn',
        
        // 缓存
        'uses-long-cache-ttl': 'warn',
        
        // 安全性
        'is-on-https': 'error',
        'uses-http2': 'warn'
      }
    },
    
    // 上传配置
    upload: {
      // 上传到 Lighthouse CI 服务器
      target: 'temporary-public-storage'
    },
    
    // 服务器配置（如果使用自己的 LHCI 服务器）
    server: {
      // port: 9001,
      // storage: {
      //   storageMethod: 'sql',
      //   sqlDialect: 'sqlite',
      //   sqlDatabasePath: './lhci.db'
      // }
    }
  }
};