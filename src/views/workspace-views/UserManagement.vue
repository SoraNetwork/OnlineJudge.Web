<template>
  <div class="flex flex-col px-6 py-8 max-w-7xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">用户管理</h1>
      <p class="text-neutral-600 dark:text-neutral-400">管理系统用户、角色和权限</p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="relative">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索用户名/昵称/邮箱..."
          class="w-full px-3 py-2 pr-10 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600"
        />
        <Icon
          icon="fluent:search-20-regular"
          class="absolute right-3 top-2.5 w-5 h-5 text-neutral-400"
        />
      </div>
      
      <fluent-select v-model="statusFilter" class="w-full">
        <fluent-option value="all">所有状态</fluent-option>
        <fluent-option value="active">正常</fluent-option>
        <fluent-option value="disabled">已禁用</fluent-option>
      </fluent-select>
      
      <fluent-select v-model="roleFilter" class="w-full">
        <fluent-option value="all">所有角色</fluent-option>
        <fluent-option value="admin">管理员</fluent-option>
        <fluent-option value="team-admin">团队管理员</fluent-option>
        <fluent-option value="user">普通用户</fluent-option>
      </fluent-select>
    </div>

    <!-- 批量操作按钮 -->
    <div class="mb-4 flex gap-2">
      <fluent-button 
        appearance="outline" 
        :disabled="selectedUsers.length === 0"
        @click="openBulkActionDialog('disable')"
      >
        <Icon icon="fluent:person-prohibited-20-filled" class="w-5 h-5 mr-2" />
        禁用选中用户
      </fluent-button>
      <fluent-button 
        appearance="outline" 
        :disabled="selectedUsers.length === 0"
        @click="openBulkActionDialog('enable')"
      >
        <Icon icon="fluent:person-available-20-filled" class="w-5 h-5 mr-2" />
        启用选中用户
      </fluent-button>
      <fluent-button 
        appearance="outline" 
        :disabled="selectedUsers.length === 0"
        @click="openBulkActionDialog('delete')"
        class="text-red-600 dark:text-red-500"
      >
        <Icon icon="fluent:delete-20-filled" class="w-5 h-5 mr-2" />
        删除选中用户
      </fluent-button>
      <span class="ml-auto text-sm text-neutral-600 dark:text-neutral-400" v-if="selectedUsers.length > 0">
        已选中 {{ selectedUsers.length }} 个用户
      </span>
    </div>

    <!-- 用户列表 -->
    <fluent-card class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-neutral-100 dark:bg-neutral-800">
            <tr>
              <th class="px-4 py-3 text-left">
                <fluent-checkbox 
                  :checked="selectedUsers.length === filteredUsers.length && filteredUsers.length > 0" 
                  :indeterminate="selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length"
                  @change="toggleSelectAll"
                />
              </th>
              <th class="px-4 py-3 text-left">用户名</th>
              <th class="px-4 py-3 text-left">昵称</th>
              <th class="px-4 py-3 text-left">邮箱</th>
              <th class="px-4 py-3 text-left">角色</th>
              <th class="px-4 py-3 text-left">状态</th>
              <th class="px-4 py-3 text-left">注册时间</th>
              <th class="px-4 py-3 text-left">上次登录</th>
              <th class="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="border-b dark:border-neutral-700">
              <td class="px-4 py-3">
                <fluent-checkbox 
                  :checked="selectedUsers.includes(user.id)" 
                  @change="toggleSelectUser(user.id)" 
                />
              </td>
              <td class="px-4 py-3">{{ user.username }}</td>
              <td class="px-4 py-3">{{ user.nickname }}</td>
              <td class="px-4 py-3">{{ user.email }}</td>
              <td class="px-4 py-3">
                <span :class="{
                  'px-2 py-0.5 rounded-full text-xs': true,
                  'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200': user.role === '管理员',
                  'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200': user.role === '团队管理员',
                  'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200': user.role === '用户'
                }">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span :class="{
                  'px-2 py-0.5 rounded-full text-xs': true,
                  'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200': user.status === '正常',
                  'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200': user.status === '已禁用'
                }">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-4 py-3">{{ user.registeredAt }}</td>
              <td class="px-4 py-3">{{ user.lastLogin }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <fluent-button appearance="lightweight" size="small" @click="openEditDialog(user)">
                    <Icon icon="fluent:edit-20-regular" class="w-4 h-4" />
                  </fluent-button>
                  <fluent-button 
                    appearance="lightweight" 
                    size="small"
                    @click="toggleUserStatus(user.id)"
                    :class="user.status === '正常' ? 'text-red-600' : 'text-green-600'"
                  >
                    <Icon 
                      :icon="user.status === '正常' ? 'fluent:person-prohibited-20-regular' : 'fluent:person-available-20-regular'" 
                      class="w-4 h-4" 
                    />
                  </fluent-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </fluent-card>

    <!-- 分页 -->
    <div class="mt-4 flex justify-between items-center">
      <div class="text-sm text-neutral-600 dark:text-neutral-400">
        显示第 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, totalUsers) }} 条，共 {{ totalUsers }} 条
      </div>
      <div class="flex gap-1">
        <fluent-button 
          appearance="lightweight" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <Icon icon="fluent:chevron-left-20-filled" class="w-5 h-5" />
        </fluent-button>
        
        <fluent-button 
          v-for="page in 5" 
          :key="page"
          appearance="lightweight"
          :class="page === currentPage ? 'bg-neutral-200 dark:bg-neutral-700' : ''"
          @click="changePage(page)"
        >
          {{ page }}
        </fluent-button>
        
        <fluent-button 
          appearance="lightweight" 
          :disabled="currentPage * pageSize >= totalUsers"
          @click="changePage(currentPage + 1)"
        >
          <Icon icon="fluent:chevron-right-20-filled" class="w-5 h-5" />
        </fluent-button>
      </div>
    </div>

    <!-- 编辑用户对话框 -->
    <fluent-dialog :open="isEditDialogOpen" @close="isEditDialogOpen = false">
      <div slot="title">编辑用户</div>
      <form v-if="editingUser" @submit.prevent="saveUserEdit" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">用户名</label>
            <input v-model="editingUser.username" type="text" class="w-full px-3 py-2 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">昵称</label>
            <input v-model="editingUser.nickname" type="text" class="w-full px-3 py-2 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">邮箱</label>
            <input v-model="editingUser.email" type="email" class="w-full px-3 py-2 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">角色</label>
            <fluent-select v-model="editingUser.role" class="w-full">
              <fluent-option value="管理员">管理员</fluent-option>
              <fluent-option value="团队管理员">团队管理员</fluent-option>
              <fluent-option value="用户">用户</fluent-option>
            </fluent-select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">状态</label>
            <fluent-select v-model="editingUser.status" class="w-full">
              <fluent-option value="正常">正常</fluent-option>
              <fluent-option value="已禁用">已禁用</fluent-option>
            </fluent-select>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <fluent-button appearance="outline" @click="isEditDialogOpen = false">取消</fluent-button>
          <fluent-button type="submit" appearance="primary">保存</fluent-button>
        </div>
      </form>
    </fluent-dialog>

    <!-- 批量操作对话框 -->
    <fluent-dialog :open="isBulkActionDialogOpen" @close="isBulkActionDialogOpen = false">
      <div slot="title">批量操作</div>
      <div class="p-6">
        <p>确定要对选中的用户执行以下操作吗？</p>
        <p class="font-bold mt-2">{{ bulkAction === 'disable' ? '禁用' : bulkAction === 'enable' ? '启用' : '删除' }} 选中用户</p>
        <div class="mt-6 flex justify-end gap-2">
          <fluent-button appearance="outline" @click="isBulkActionDialogOpen = false">取消</fluent-button>
          <fluent-button appearance="primary" @click="executeBulkAction">确认</fluent-button>
        </div>
      </div>
    </fluent-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';

document.title = "Sora Online Judge • 用户管理";

// 模拟用户数据
const users = ref([
  { 
    id: 1, 
    username: 'admin', 
    nickname: 'Admin', 
    email: 'admin@example.com', 
    role: '管理员', 
    status: '正常',
    registeredAt: '2023-10-01',
    lastLogin: '2024-03-20'
  },
  { 
    id: 2, 
    username: 'alice', 
    nickname: 'Alice', 
    email: 'alice@example.com', 
    role: '用户', 
    status: '正常',
    registeredAt: '2023-12-15',
    lastLogin: '2024-03-19'
  },
  { 
    id: 3, 
    username: 'bob', 
    nickname: 'Bob', 
    email: 'bob@example.com', 
    role: '团队管理员', 
    status: '正常',
    registeredAt: '2023-12-16',
    lastLogin: '2024-03-18'
  },
  { 
    id: 4, 
    username: 'charlie', 
    nickname: 'Charlie', 
    email: 'charlie@example.com', 
    role: '用户', 
    status: '已禁用',
    registeredAt: '2023-12-17',
    lastLogin: '2024-02-28'
  },
]);

// 搜索和筛选
const searchKeyword = ref('');
const statusFilter = ref('all'); // 'all', 'active', 'disabled'
const roleFilter = ref('all'); // 'all', 'admin', 'team-admin', 'user'

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const totalUsers = ref(100); // 模拟总用户数

// 排序
const sortField = ref('username');
const sortDirection = ref('asc');

// 选中的用户
const selectedUsers = ref<number[]>([]);

// 编辑用户对话框
const isEditDialogOpen = ref(false);
const editingUser = ref<any>(null);

// 批量操作对话框
const isBulkActionDialogOpen = ref(false);
const bulkAction = ref(''); // 'disable', 'enable', 'delete', 'change-role'

const filteredUsers = computed(() => {
  let result = users.value;
  
  // 搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(user => 
      user.username.toLowerCase().includes(keyword) || 
      user.nickname.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
  }
  
  // 状态筛选
  if (statusFilter.value === 'active') {
    result = result.filter(user => user.status === '正常');
  } else if (statusFilter.value === 'disabled') {
    result = result.filter(user => user.status === '已禁用');
  }
  
  // 角色筛选
  if (roleFilter.value === 'admin') {
    result = result.filter(user => user.role === '管理员');
  } else if (roleFilter.value === 'team-admin') {
    result = result.filter(user => user.role === '团队管理员');
  } else if (roleFilter.value === 'user') {
    result = result.filter(user => user.role === '用户');
  }
  
  return result;
});

// 打开编辑用户对话框
const openEditDialog = (user: any) => {
  editingUser.value = { ...user };
  isEditDialogOpen.value = true;
};

// 保存用户编辑
const saveUserEdit = () => {
  if (editingUser.value) {
    const index = users.value.findIndex(u => u.id === editingUser.value.id);
    if (index !== -1) {
      users.value[index] = { ...editingUser.value };
    }
  }
  isEditDialogOpen.value = false;
};

// 改变用户状态
const toggleUserStatus = (userId: number) => {
  const index = users.value.findIndex(user => user.id === userId);
  if (index !== -1) {
    users.value[index].status = users.value[index].status === '正常' ? '已禁用' : '正常';
  }
};

// 选择/取消选择所有用户
const toggleSelectAll = () => {
  if (selectedUsers.value.length === filteredUsers.value.length) {
    selectedUsers.value = [];
  } else {
    selectedUsers.value = filteredUsers.value.map(user => user.id);
  }
};

// 选择/取消选择单个用户
const toggleSelectUser = (userId: number) => {
  const index = selectedUsers.value.indexOf(userId);
  if (index === -1) {
    selectedUsers.value.push(userId);
  } else {
    selectedUsers.value.splice(index, 1);
  }
};

// 打开批量操作对话框
const openBulkActionDialog = (action: string) => {
  if (selectedUsers.value.length === 0) return;
  bulkAction.value = action;
  isBulkActionDialogOpen.value = true;
};

// 执行批量操作
const executeBulkAction = () => {
  if (bulkAction.value === 'disable') {
    users.value = users.value.map(user => 
      selectedUsers.value.includes(user.id) ? { ...user, status: '已禁用' } : user
    );
  } else if (bulkAction.value === 'enable') {
    users.value = users.value.map(user => 
      selectedUsers.value.includes(user.id) ? { ...user, status: '正常' } : user
    );
  } else if (bulkAction.value === 'delete') {
    users.value = users.value.filter(user => !selectedUsers.value.includes(user.id));
  } else if (bulkAction.value === 'change-role') {
    // 这里可以添加更改角色的逻辑
  }
  
  selectedUsers.value = [];
  isBulkActionDialogOpen.value = false;
};

// 处理分页
const changePage = (page: number) => {
  currentPage.value = page;
  // 这里可以添加获取对应页数据的API调用
};

onMounted(() => {
  // 这里可以添加获取用户列表的API调用
});
</script>

<style scoped>
.user-management {
  padding: 20px;
}
</style>
