// 终端内容管理
document.addEventListener('DOMContentLoaded', () => {
  // 个人介绍内容
  const bioContent = document.getElementById('bio-content');
  const bioText = `
姓名: 你的名字
职业: 你的职业
简介: 这里是你的个人简介，可以写一些关于你自己的介绍。
      你可以描述你的技能、经验、兴趣爱好等。
      
技能:
- 技能1
- 技能2
- 技能3

教育背景:
- 学校名称 (年份-年份)
  专业: 你的专业

工作经历:
- 公司名称 (年份-年份)
  职位: 你的职位
  
兴趣爱好:
- 爱好1
- 爱好2
- 爱好3
`;

  // 个人链接内容
  const linksContent = document.getElementById('links-content');
  const linksText = `
drwxr-xr-x  2 user  group  4096 Jan 1 2023 .
drwxr-xr-x 10 user  group  4096 Jan 1 2023 ..
-rw-r--r--  1 user  group   220 Jan 1 2023 <a href="https://github.com/yourusername" target="_blank"><i class="fab fa-github"></i> GitHub</a>
-rw-r--r--  1 user  group   220 Jan 1 2023 <a href="https://linkedin.com/in/yourusername" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>
-rw-r--r--  1 user  group   220 Jan 1 2023 <a href="https://twitter.com/yourusername" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>
-rw-r--r--  1 user  group   220 Jan 1 2023 <a href="mailto:your.email@example.com"><i class="fas fa-envelope"></i> Email</a>
-rw-r--r--  1 user  group   220 Jan 1 2023 <a href="https://yourwebsite.com" target="_blank"><i class="fas fa-globe"></i> 个人网站</a>
`;

  // 加密哈希内容
  const hashContent = document.getElementById('hash-content');
  const hashText = `
输入字符串: "Hello, World!"
MD5: 65a8e27d8879283831b664bd8b7f0ad4
SHA1: 0a0a9f2a6772942557ab5355d76af442f8f65e01
SHA256: dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f

输入字符串: "你的名字"
MD5: ${generateRandomHash(32)}
SHA1: ${generateRandomHash(40)}
SHA256: ${generateRandomHash(64)}

输入字符串: "你的座右铭"
MD5: ${generateRandomHash(32)}
SHA1: ${generateRandomHash(40)}
SHA256: ${generateRandomHash(64)}
`;

  // 页脚链接
  const footerLinks = document.getElementById('footer-links');
  const footerLinksHTML = `
<a href="https://github.com/yourusername" target="_blank"><i class="fab fa-github"></i> GitHub</a>
<a href="https://linkedin.com/in/yourusername" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>
<a href="mailto:your.email@example.com"><i class="fas fa-envelope"></i> Email</a>
<a href="https://yourwebsite.com" target="_blank"><i class="fas fa-globe"></i> 个人网站</a>
`;

  // 填充内容
  bioContent.innerHTML = formatTerminalOutput(bioText);
  linksContent.innerHTML = linksText;
  hashContent.innerHTML = formatTerminalOutput(hashText);
  footerLinks.innerHTML = footerLinksHTML;

  // 添加终端交互效果
  addTerminalInteractivity();
});

// 格式化终端输出，保留换行和空格
function formatTerminalOutput(text) {
  return text.replace(/\n/g, '<br>')
             .replace(/\s{2}/g, '&nbsp;&nbsp;');
}

// 生成随机哈希值（用于演示）
function generateRandomHash(length) {
  const characters = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// 添加终端交互效果
function addTerminalInteractivity() {
  // 获取所有终端
  const terminals = document.querySelectorAll('.terminal');
  
  terminals.forEach(terminal => {
    // 获取终端按钮
    const closeBtn = terminal.querySelector('.close');
    const minimizeBtn = terminal.querySelector('.minimize');
    const maximizeBtn = terminal.querySelector('.maximize');
    
    // 关闭按钮点击事件
    closeBtn.addEventListener('click', () => {
      terminal.style.transition = 'opacity 0.3s, transform 0.3s';
      terminal.style.opacity = '0';
      terminal.style.transform = 'scale(0.9)';
      
      setTimeout(() => {
        terminal.style.display = 'none';
      }, 300);
    });
    
    // 最小化按钮点击事件
    minimizeBtn.addEventListener('click', () => {
      const content = terminal.querySelector('.terminal-content');
      
      if (content.style.display === 'none') {
        content.style.display = 'block';
        terminal.style.flex = '1';
      } else {
        content.style.display = 'none';
        terminal.style.flex = '0';
      }
    });
    
    // 最大化按钮点击事件
    maximizeBtn.addEventListener('click', () => {
      terminal.classList.toggle('fullscreen-terminal');
    });
  });
} 