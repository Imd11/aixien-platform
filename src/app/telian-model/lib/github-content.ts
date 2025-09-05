// GitHub内容获取模块
export class TelianKnowledgeFetcher {
  private cache: string | null = null;
  private lastFetch: number = 0;
  private CACHE_DURATION = 60 * 60 * 1000; // 1小时缓存
  
  async fetchAllMarkdownFiles(): Promise<string> {
    // 检查缓存
    if (this.cache && Date.now() - this.lastFetch < this.CACHE_DURATION) {
      console.log('使用缓存的GitHub知识库内容');
      return this.cache;
    }
    
    try {
      // 1. 先获取文件列表
      const response = await fetch(
        'https://api.github.com/repos/Imd11/telianguangdian/contents',
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            // 使用GitHub token进行认证
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`GitHub API responded with status: ${response.status}`);
      }
      
      const files = await response.json();
      
      // 2. 筛选出所有.md文件
      const mdFiles = files.filter((f: any) => 
        f.name.endsWith('.md') && f.type === 'file'
      );
      
      // 3. 并行获取所有md文件内容（限制并发数量）
      const batchSize = 5; // 每批处理5个文件
      const contents: string[] = [];
      
      for (let i = 0; i < mdFiles.length; i += batchSize) {
        const batch = mdFiles.slice(i, i + batchSize);
        const batchContents = await Promise.all(
          batch.map(async (file: any) => {
            try {
              const res = await fetch(file.download_url);
              if (!res.ok) {
                console.error(`Failed to fetch ${file.name}: ${res.status}`);
                return `\n\n## 📄 ${file.name}\n\n[内容获取失败]`;
              }
              const text = await res.text();
              return `\n\n## 📄 ${file.name}\n\n${text}`;
            } catch (error) {
              console.error(`Error fetching ${file.name}:`, error);
              return `\n\n## 📄 ${file.name}\n\n[内容获取失败]`;
            }
          })
        );
        contents.push(...batchContents);
      }
      
      // 4. 合并所有内容
      let fullContent = `# 特连光电知识库\n\n更新时间: ${new Date().toLocaleString('zh-CN')}\n` 
                        + contents.join('\n---');
      
      // 5. 智能截断（Gemini API限制）
      const MAX_CHARS = 300000; // 约75K tokens，留余地给用户输入和输出
      if (fullContent.length > MAX_CHARS) {
        // 截断但保留完整段落
        const truncated = fullContent.slice(0, MAX_CHARS);
        const lastParagraph = truncated.lastIndexOf('\n\n');
        fullContent = truncated.slice(0, lastParagraph) + 
                      '\n\n...(知识库内容因长度限制已截断，仅显示部分内容)';
      }
      
      // 6. 更新缓存
      this.cache = fullContent;
      this.lastFetch = Date.now();
      
      console.log(`成功获取特连光电知识库，总大小: ${(fullContent.length / 1024).toFixed(2)} KB`);
      
      return fullContent;
    } catch (error) {
      console.error('获取GitHub内容失败:', error);
      
      // 返回缓存或备用内容
      if (this.cache) {
        console.log('使用缓存的知识库内容');
        return this.cache;
      }
      
      // 返回备用内容
      return this.getFallbackContent();
    }
  }
  
  // 备用内容（当GitHub无法访问时使用）
  private getFallbackContent(): string {
    return `# 特连光电知识库（备用版本）

## 核心管理理念

### 客户价值导向
- 一切以客户价值为中心
- 客户价值即大海，是企业发展的根本方向
- 问题即潜在利润，每个问题都是改进的机会

### 管理原则
- 日结果与日计划管理
- 百分百责任制
- 职业化标准执行
- 持续改进与创新

### 四阶段思维模型
1. 拥抱冲突（木材思维）- 识别问题
2. 肯定利益（承认差异）- 理解多元
3. 找到真利益（价值标准）- 价值判断
4. 向往大海（共同利益）- 协同共赢

注：当前无法访问完整知识库，使用备用版本。建议稍后重试以获取最新内容。`;
  }
  
  // 清除缓存（可选方法）
  clearCache(): void {
    this.cache = null;
    this.lastFetch = 0;
    console.log('知识库缓存已清除');
  }
}

// 创建单例实例
export const telianKnowledgeFetcher = new TelianKnowledgeFetcher();