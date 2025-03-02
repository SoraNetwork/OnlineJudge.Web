<template>
  <div class="user-management">
    <h1>用户管理</h1>
    <n-data-table
      :columns="columns"
      :data="users"
      :pagination="pagination"
      :loading="loading"
      @update:page="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { NDataTable, NButton, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import axios from 'axios'

const message = useMessage()
const loading = ref(false)
const users = ref([])

const pagination = {
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageCount: 1,
  onChange: (page: number) => {
    loadUsers(page)
  }
}

const columns: DataTableColumns = [
  {
    title: '用户ID',
    key: 'id'
  },
  {
    title: '用户名',
    key: 'username'
  },
  {
    title: '邮箱',
    key: 'email'
  },
  {
    title: '注册时间',
    key: 'createdAt'
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            onClick: () => handleEdit(row)
          },
          { default: () => '编辑' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            class: 'ml-2',
            onClick: () => handleDelete(row)
          },
          { default: () => '删除' }
        )
      ]
    }
  }
]

const loadUsers = async (page: number) => {
  loading.value = true
  try {
    const response = await axios.get(`/api/admin/users?page=${page}`)
    users.value = response.data.items
    pagination.pageCount = response.data.totalPages
  } catch (error) {
    message.error('加载用户列表失败')
  }
  loading.value = false
}

const handleEdit = (user: any) => {
  // 实现编辑用户逻辑
}

const handleDelete = async (user: any) => {
  if (confirm(`确定要删除用户 ${user.username} 吗？`)) {
    try {
      await axios.delete(`/api/admin/users/${user.id}`)
      message.success('删除成功')
      loadUsers(pagination.page)
    } catch (error) {
      message.error('删除失败')
    }
  }
}

const handlePageChange = (page: number) => {
  loadUsers(page)
}

onMounted(() => {
  loadUsers(1)
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}
</style>
