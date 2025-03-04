<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Icon } from '@iconify/vue';

document.title = "Sora Online Judge • 系统监控";

// 系统状态
const systemStatus = ref({
  status: 'online', // online, maintenance, degraded, offline
  uptime: '15d 7h 23m',
  lastRestart: '2024-03-05 04:30:21',
  version: 'v1.0.3'
});

// CPU 使用率历史数据
const cpuUsage = ref({
  current: 45,
  history: [40, 38, 42, 45, 37, 35, 39, 41, 48, 45, 52, 56, 49, 45]
});

// 内存使用率历史数据
const memoryUsage = ref({
  total: 16, // GB
  used: 6.8, // GB
  history: [35, 37, 40, 42, 45, 48, 46, 43, 40, 38, 42, 45, 43, 42]
});

// 存储空间
const storageUsage = ref({
  total: 500, // GB
  used: 137, // GB
  usage: 27 // 百分比
});

// 评测队列
const judgeQueue = ref({
  pending: 3,
  processing: 2,
  averageTime: '1.2s'
});

// 系统服务状态
const services = ref([
  { id: 1, name: '评测服务', status: 'online', lastIssue: null },
  { id: 2, name: '数据库服务', status: 'online', lastIssue: '2024-03-18 02:15:32' },
  { id: 3, name: '缓存服务', status: 'online', lastIssue: null },
  { id: 4, name: '邮件服务', status: 'degraded', lastIssue: '2024-03-20 10:45:12' }
]);

// 访问统计
const visitorStats = ref({
  today: 1245,
  yesterday: 1103,
  thisWeek: 8320,
  lastWeek: 7890,
  thisMonth: 32450,
  lastMonth: 31200
});

// 提交统计
const submissionStats = ref({
  today: 456,
  yesterday: 423,
  thisWeek: 3120,
  lastWeek: 2950,
  thisMonth: 12350,
  lastMonth: 11800
});

// 近期事件日志
const recentLogs = ref([
  { id: 1, time: '2024-03-20 15:32:45', level: 'warning', message: '邮件服务响应缓慢' },
  { id: 2, time: '2024-03-20 14:15:12', level: 'info', message: '自动备份已完成' },
  { id: 3, time: '2024-03-20 12:30:08', level: 'error', message: '评测节点 judge-3 连接超时' },
  { id: 4, time: '2024-03-20 10:45:12', level: 'warning', message: '邮件服务连接不稳定' },
  { id: 5, time: '2024-03-20 09:30:00', level: 'info', message: '系统更新已应用' }
]);

// 是否自动刷新
const autoRefresh = ref(true);
let refreshInterval: number | null = null;

// 启动自动刷新
const startAutoRefresh = () => {
  if (!refreshInterval) {
    refreshInterval = window.setInterval(() => {
      refreshData();
    }, 30000); // 每30秒刷新一次
  }
};

// 停止自动刷新
const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

// 切换自动刷新
const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value;
  if (autoRefresh.value) {
    startAutoRefresh();
  } else {
    stopAutoRefresh();
  }
};

// 手动刷新数据
const refreshData = () => {
  // 模拟数据更新
  cpuUsage.value.history.shift();
  cpuUsage.value.history.push(Math.floor(Math.random() * 30) + 30);
  cpuUsage.value.current = cpuUsage.value.history[cpuUsage.value.history.length - 1];
  
  memoryUsage.value.history.shift();
  memoryUsage.value.history.push(Math.floor(Math.random() * 20) + 35);
  memoryUsage.value.used = parseFloat((memoryUsage.value.total * memoryUsage.value.history[memoryUsage.value.history.length - 1] / 100).toFixed(1));
  
  judgeQueue.value.pending = Math.floor(Math.random() * 10);
  judgeQueue.value.processing = Math.floor(Math.random() * 5);
  judgeQueue.value.averageTime = (Math.random() * 2 + 0.5).toFixed(1) + 's';
  
  // 更新系统状态
  const uptimeMinutes = parseInt(systemStatus.value.uptime.split('m')[0].split('h ')[1]) + 1;
  let uptimeHours = parseInt(systemStatus.value.uptime.split('h')[0].split('d ')[1]);
  let uptimeDays = parseInt(systemStatus.value.uptime.split('d')[0]);
  
  if (uptimeMinutes >= 60) {
    uptimeHours += 1;
    if (uptimeHours >= 24) {
      uptimeDays += 1;
      uptimeHours = 0;
    }
    systemStatus.value.uptime = `${uptimeDays}d ${uptimeHours}h 0m`;
  } else {
    systemStatus.value.uptime = `${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m`;
  }
};

// 获取状态对应的颜色
const getStatusColor = (status: string) => {
  const colors = {
    'online': 'text-green-500',
    'maintenance': 'text-yellow-500',
    'degraded': 'text-orange-500',
    'offline': 'text-red-500'
  };
  return colors[status as keyof typeof colors] || 'text-neutral-500';
};

// 获取日志级别对应的颜色
const getLogLevelColor = (level: string) => {
  const colors = {
    'info': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    'warning': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    'error': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  };
  return colors[level as keyof typeof colors] || 'bg-neutral-100 dark:bg-neutral-800';
};

// 获取日志级别对应的图标
const getLogLevelIcon = (level: string) => {
  const icons = {
    'info': 'fluent:info-20-regular',
    'warning': 'fluent:warning-20-regular',
    'error': 'fluent:error-circle-20-regular'
  };
  return icons[level as keyof typeof icons] || 'fluent:info-20-regular';
};

onMounted(() => {
  if (autoRefresh.value) {
    startAutoRefresh();
  }
});

onBeforeUnmount(() => {
  stopAutoRefresh();
});
</script>

<template>
  <div class="flex flex-col px-6 py-8 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">系统监控</h1>
        <p class="text-neutral-600 dark:text-neutral-400">查看系统状态、资源使用和访问统计</p>
      </div>
      <div class="flex gap-4 items-center">
        <div class="flex items-center gap-2">
          <span class="text-sm">自动刷新</span>
          <fluent-switch :checked="autoRefresh" @change="toggleAutoRefresh" />
        </div>
        <fluent-button appearance="outline" @click="refreshData">
          <Icon icon="fluent:arrow-sync-20-filled" class="w-5 h-5 mr-2" />
          刷新数据
        </fluent-button>
      </div>
    </div>

    <!-- 系统状态概览 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <fluent-card class="p-5">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-sm font-medium text-neutral-600 dark:text-neutral-400">系统状态</h3>
          <div :class="`px-2 py-0.5 rounded-full text-xs ${getStatusColor(systemStatus.status)}`">
            {{ systemStatus.status === 'online' ? '正常' : 
               systemStatus.status === 'maintenance' ? '维护中' : 
               systemStatus.status === 'degraded' ? '部分服务不可用' : '离线' }}
          </div>
        </div>
        <div class="text-2xl font-semibold mb-2">{{ systemStatus.version }}</div>
        <div class="text-sm text-neutral-600 dark:text-neutral-400">
          运行时间: {{ systemStatus.uptime }}
        </div>
      </fluent-card>

      <fluent-card class="p-5">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-sm font-medium text-neutral-600 dark:text-neutral-400">CPU 使用率</h3>
          <div :class="`px-2 py-0.5 rounded-full text-xs ${
            cpuUsage.current < 50 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
            cpuUsage.current < 80 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
            'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`">
            {{ cpuUsage.current }}%
          </div>
        </div>
        <div class="h-10 flex items-end gap-1">
          <div
            v-for="(item, index) in cpuUsage.history"
            :key="index"
            :style="`height: ${item}%; width: 8px`"
            :class="`transition-all rounded-t-sm ${
              item < 50 ? 'bg-green-500/80' : 
              item < 80 ? 'bg-yellow-500/80' : 
              'bg-red-500/80'
            }`"
          ></div>
        </div>
      </fluent-card>

      <fluent-card class="p-5">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-sm font-medium text-neutral-600 dark:text-neutral-400">内存使用率</h3>
          <div :class="`px-2 py-0.5 rounded-full text-xs ${
            memoryUsage.used / memoryUsage.total < 0.5 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
            memoryUsage.used / memoryUsage.total < 0.8 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
            'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`">
            {{ memoryUsage.used }}GB / {{ memoryUsage.total }}GB
          </div>
        </div>
        <div class="h-10 flex items-end gap-1">
          <div
            v-for="(item, index) in memoryUsage.history"
            :key="index"
            :style="`height: ${item}%; width: 8px`"
            :class="`transition-all rounded-t-sm ${
              item < 50 ? 'bg-green-500/80' : 
              item < 80 ? 'bg-yellow-500/80' : 
              'bg-red-500/80'
            }`"
          ></div>
        </div>
      </fluent-card>

      <fluent-card class="p-5">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-sm font-medium text-neutral-600 dark:text-neutral-400">评测队列</h3>
        </div>
        <div class="text-2xl font-semibold mb-2">{{ judgeQueue.pending }} / {{ judgeQueue.processing }}</div>
        <div class="flex justify-between">
          <div class="text-sm text-neutral-600 dark:text-neutral-400">等待中 / 运行中</div>
          <div class="text-sm text-neutral-600 dark:text-neutral-400">
            平均时间: {{ judgeQueue.averageTime }}
          </div>
        </div>
      </fluent-card>
    </div>

    <!-- 详细指标 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- 存储使用情况 -->
      <fluent-card class="p-5">
        <h3 class="text-lg font-medium mb-4">存储使用情况</h3>
        <div class="mb-4">
          <div class="flex justify-between mb-1">
            <span>{{ storageUsage.used }} GB / {{ storageUsage.total }} GB</span>
            <span>{{ storageUsage.usage }}%</span>
          </div>
          <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
            <div class="bg-blue-600 h-2.5 rounded-full" :style="`width: ${storageUsage.usage}%`"></div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div class="text-neutral-600 dark:text-neutral-400">系统</div>
            <div class="font-medium">15.2 GB</div>
          </div>
          <div>
            <div class="text-neutral-600 dark:text-neutral-400">数据库</div>
            <div class="font-medium">52.8 GB</div>
          </div>
          <div>
            <div class="text-neutral-600 dark:text-neutral-400">测试数据</div>
            <div class="font-medium">48.5 GB</div>
          </div>
          <div>
            <div class="text-neutral-600 dark:text-neutral-400">用户文件</div>
            <div class="font-medium">20.5 GB</div>
          </div>
        </div>
      </fluent-card>

      <!-- 服务状态 -->
      <fluent-card class="p-5">
        <h3 class="text-lg font-medium mb-4">服务状态</h3>
        <div class="space-y-4">
          <div v-for="service in services" :key="service.id" class="flex flex-col">
            <div class="flex justify-between items-center">
              <span>{{ service.name }}</span>
              <span :class="`text-xs rounded-full px-2 py-0.5 ${
                service.status === 'online' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                service.status === 'degraded' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                service.status === 'maintenance' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`">
                {{ 
                  service.status === 'online' ? '正常' :
                  service.status === 'degraded' ? '性能下降' :
                  service.status === 'maintenance' ? '维护中' :
                  '离线'
                }}
              </span>
            </div>
            <div v-if="service.lastIssue" class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              上次问题: {{ service.lastIssue }}
            </div>
          </div>
        </div>
      </fluent-card>

      <!-- 事件日志 -->
      <fluent-card class="p-5">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">近期事件日志</h3>
          <fluent-button appearance="stealth" size="small">查看所有日志</fluent-button>
        </div>
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <div v-for="log in recentLogs" :key="log.id" class="p-2 rounded-md bg-neutral-50 dark:bg-neutral-800">
            <div class="flex items-center gap-2">
              <Icon :icon="getLogLevelIcon(log.level)" :class="`w-4 h-4 ${
                log.level === 'info' ? 'text-blue-500' :
                log.level === 'warning' ? 'text-yellow-500' :
                'text-red-500'
              }`" />
              <span class="text-sm">{{ log.message }}</span>
            </div>
            <div class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{{ log.time }}</div>
          </div>
        </div>
      </fluent-card>
    </div>

    <!-- 访问统计 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 访问统计 -->
      <fluent-card class="p-5">
        <h3 class="text-lg font-medium mb-4">访问统计</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div class="text-neutral-600 dark:text-neutral-400 text-sm">今日访问</div>
            <div class="text-xl font-semibold">{{ visitorStats.today }}</div>
            <div class="text-xs text-green-600 dark:text-green-400" v-if="visitorStats.today > visitorStats.yesterday">
              +{{ ((visitorStats.today - visitorStats.yesterday) / visitorStats.yesterday * 100).toFixed(1) }}%
            </div>
            <div class="text-xs text-red-600 dark:text-red-400" v-else-if="visitorStats.today < visitorStats.yesterday">
              -{{ ((visitorStats.yesterday - visitorStats.today) / visitorStats.yesterday * 100).toFixed(1) }}%
            </div>
          </div>
          <div>
            <div class="text-neutral-600 dark:text-neutral-400 text-sm">本周访问</div>
            <div class="text-xl font-semibold">{{ visitorStats.thisWeek }}</div>
            <div class="text-xs text-green-600 dark:text-green-400" v-if="visitorStats.thisWeek > visitorStats.lastWeek">
              +{{ ((visitorStats.thisWeek - visitorStats.lastWeek) / visitorStats.lastWeek * 100).toFixed(1) }}%
            </div>
            <div class="text-xs text-red-600 dark:text-red-400" v-else-if="visitorStats.thisWeek < visitorStats.lastWeek">
              -{{ ((visitorStats.lastWeek - visitorStats.thisWeek) / visitorStats.lastWeek * 100).toFixed(1) }}%
            </div>
          </div>
          <div>
            <div class="text-neutral-600 dark:text-neutral-400 text-sm">本月访问</div>
            <div class="text-xl font-semibold">{{ visitorStats.thisMonth }}</div>
            <div class="text-xs text-green-600 dark:text-green-400" v-if="visitorStats.thisMonth > visitorStats.lastMonth">
              +{{ ((visitorStats.thisMonth - visitorStats.lastMonth) / visitorStats.lastMonth * 100).toFixed(1) }}%
            </div>
            <div class="text-xs text-red-600 dark:text-red-400" v-else-if="visitorStats.thisMonth < visitorStats.lastMonth">
              -{{ ((visitorStats.lastMonth - visitorStats.thisMonth) / visitorStats.lastMonth * 100).toFixed(1) }}%
            </div>
          </div>
        </div>
      </fluent-card>
      
      <!-- 提交统计 -->
      <fluent-card class="p-5">
        <h3 class="text-lg font-medium mb-4">提交统计</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div class="text-neutral-600 dark:text-neutral-400 text-sm">今日提交</div>
            <div class="text-xl font-semibold">{{ submissionStats.today }}</div>
            <div class="text-xs text-green-600 dark:text-green-400" v-if="submissionStats.today > submissionStats.yesterday">
              +{{ ((submissionStats.today - submissionStats.yesterday) / submissionStats.yesterday * 100).toFixed(1) }}%
            </div>
            <div class="text-xs text-red-600 dark:text-red-400" v-else-if="submissionStats.today < submissionStats.yesterday">
              -{{ ((submissionStats.yesterday - submissionStats.today) / submissionStats.yesterday * 100).toFixed(1) }}%
            </div>
          </div>
          <div>
            <div class="text-neutral-600 dark:text-neutral-400 text-sm">本周提交</div>
            <div class="text-xl font-semibold">{{ submissionStats.thisWeek }}</div>
            <div class="text-xs text-green-600 dark:text-green-400" v-if="submissionStats.thisWeek > submissionStats.lastWeek">
              +{{ ((submissionStats.thisWeek - submissionStats.lastWeek) / submissionStats.lastWeek * 100).toFixed(1) }}%
            </div>
            <div class="text-xs text-red-600 dark:text-red-400" v-else-if="submissionStats.thisWeek < submissionStats.lastWeek">
              -{{ ((submissionStats.lastWeek - submissionStats.thisWeek) / submissionStats.lastWeek * 100).toFixed(1) }}%
            </div>
          </div>
          <div>
            <div class="text-neutral-600 dark:text-neutral-400 text-sm">本月提交</div>
            <div class="text-xl font-semibold">{{ submissionStats.thisMonth }}</div>
            <div class="text-xs text-green-600 dark:text-green-400" v-if="submissionStats.thisMonth > submissionStats.lastMonth">
              +{{ ((submissionStats.thisMonth - submissionStats.lastMonth) / submissionStats.lastMonth * 100).toFixed(1) }}%
            </div>
            <div class="text-xs text-red-600 dark:text-red-400" v-else-if="submissionStats.thisMonth < submissionStats.lastMonth">
              -{{ ((submissionStats.lastMonth - submissionStats.thisMonth) / submissionStats.lastMonth * 100).toFixed(1) }}%
            </div>
          </div>
        </div>
      </fluent-card>
    </div>
    
    <!-- 系统操作 -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <fluent-card class="p-5 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
        <div class="flex flex-col items-center justify-center">
          <Icon icon="fluent:arrow-sync-circle-20-filled" class="w-10 h-10 text-blue-600 dark:text-blue-400 mb-2" />
          <span class="font-medium">重启服务</span>
        </div>
      </fluent-card>
      
      <fluent-card class="p-5 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
        <div class="flex flex-col items-center justify-center">
          <Icon icon="fluent:database-plug-connected-20-filled" class="w-10 h-10 text-green-600 dark:text-green-400 mb-2" />
          <span class="font-medium">备份数据库</span>
        </div>
      </fluent-card>
      
      <fluent-card class="p-5 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
        <div class="flex flex-col items-center justify-center">
          <Icon icon="fluent:delete-20-filled" class="w-10 h-10 text-orange-600 dark:text-orange-400 mb-2" />
          <span class="font-medium">清理缓存</span>
        </div>
      </fluent-card>
      
      <fluent-card class="p-5 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
        <div class="flex flex-col items-center justify-center">
          <Icon icon="fluent:arrow-download-20-filled" class="w-10 h-10 text-purple-600 dark:text-purple-400 mb-2" />
          <span class="font-medium">检查更新</span>
        </div>
      </fluent-card>
    </div>
  </div>
</template>

<style scoped>
/* 添加一些边界过渡效果 */
.bg-green-500\/80, .bg-yellow-500\/80, .bg-red-500\/80 {
  transition: height 0.3s ease;
}
</style>