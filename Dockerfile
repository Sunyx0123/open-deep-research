FROM node:20-alpine

WORKDIR /app

# 安装特定版本的 pnpm（可能需要匹配项目中使用的版本）
# 查看您的 package.json 中可能指定的 pnpm 版本，或尝试与您本地开发环境相同的版本
RUN npm install -g pnpm@8.10.2

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 使用 --no-frozen-lockfile 标志告诉 pnpm 不要严格遵循锁文件
# 这将允许 pnpm 更新锁文件以匹配当前版本
RUN pnpm install --no-frozen-lockfile

# 复制应用程序的其余部分
COPY . .

# 构建应用程序
RUN pnpm build

# 暴露端口
EXPOSE 3000

# 创建启动脚本
COPY start.sh /start.sh
RUN chmod +x /start.sh

# 使用启动脚本启动应用程序
CMD ["/start.sh"]