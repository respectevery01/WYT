// 打字动画效果
document.addEventListener('DOMContentLoaded', () => {
  const typingText = document.getElementById('typing-text');
  const typingContainer = document.getElementById('typing-container');
  const mainContent = document.getElementById('main-content');
  
  // 确保初始状态正确
  typingText.textContent = '';
  
  // 打字动画的文本内容
  const text = "欢迎访问我的终端风格个人主页...\n正在初始化系统...\n加载个人资料...\n准备完毕，按任意键继续...";
  
  let charIndex = 0;
  const typingSpeed = 50; // 打字速度（毫秒/字符）
  
  // 打字效果函数
  function typeText() {
    if (charIndex < text.length) {
      typingText.textContent += text.charAt(charIndex);
      charIndex++;
      setTimeout(typeText, typingSpeed);
    } else {
      // 打字完成后，添加闪烁的光标
      typingText.innerHTML += '<span class="cursor">_</span>';
      
      // 添加闪烁效果
      setInterval(() => {
        const cursor = document.querySelector('.cursor');
        if (cursor) {
          cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }
      }, 500);
      
      // 监听任意键按下事件
      document.addEventListener('keydown', showMainContent);
      // 也可以点击屏幕继续
      document.addEventListener('click', showMainContent);
    }
  }
  
  // 显示主内容
  function showMainContent() {
    // 移除事件监听器，防止重复触发
    document.removeEventListener('keydown', showMainContent);
    document.removeEventListener('click', showMainContent);
    
    // 隐藏打字动画，显示主内容
    typingContainer.style.display = 'none';
    mainContent.classList.remove('hidden');
  }
  
  // 添加光标样式
  const style = document.createElement('style');
  style.textContent = `
    .cursor {
      opacity: 1;
      font-weight: bold;
      animation: blink 0.5s infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  // 开始打字动画
  setTimeout(typeText, 500);
}); 