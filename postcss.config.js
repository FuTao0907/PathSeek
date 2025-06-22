module.exports = {
  plugins: {
    // Tailwind CSS
    'tailwindcss': {},
    
    // CSS导入处理
    'postcss-import': {
      path: ['src/styles']
    },
    
    // CSS自定义属性处理 - 保留变量以支持主题切换
    'postcss-custom-properties': {
      preserve: true, // 改为true以支持运行时主题切换
      importFrom: 'src/styles/variables.css'
    },
    
    // CSS自定义媒体查询
    'postcss-custom-media': {},
    
    // CSS嵌套支持
    'postcss-nesting': {},
    
    // 自动前缀
    'autoprefixer': {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11'
      ],
      grid: true,
      flexbox: 'no-2009'
    },
    
    // PostCSS预设环境
    'postcss-preset-env': {
      stage: 1,
      features: {
        'custom-properties': false, // 由postcss-custom-properties处理
        'nesting-rules': false, // 由postcss-nesting处理
        'custom-media-queries': true,
        'media-query-ranges': true
      }
    },
    
    // 生产环境优化
    'cssnano': process.env.NODE_ENV === 'production' ? {
      preset: ['default', {
        // 保留重要的注释（如许可证信息）
        discardComments: {
          removeAll: false,
          removeAllButFirst: true
        },
        // 保留CSS变量名称
        reduceIdents: false,
        // 保留z-index值
        zindex: false,
        // 安全的合并规则
        mergeRules: true,
        // 优化空白字符
        normalizeWhitespace: true,
        // 优化选择器
        minifySelectors: true,
        // 优化参数
        minifyParams: true,
        // 移除未使用的CSS（谨慎使用）
        discardUnused: {
          fontFace: false // 保留字体定义
        }
      }]
    } : false
  }
};