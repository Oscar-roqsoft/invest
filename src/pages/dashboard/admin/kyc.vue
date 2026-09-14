<template>
    <div>
      <!-- Stats Row -->
      <div v-if="store.state.kycStats" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="stat-card">
          <div class="text-xs uppercase tracking-wider opacity-60">Pending</div>
          <div class="text-3xl font-bold mt-1">{{ store.state.kycStats.pending }}</div>
        </div>
        <div class="stat-card">
          <div class="text-xs uppercase tracking-wider opacity-60">Approved</div>
          <div class="text-3xl font-bold mt-1 text-emerald-400">{{ store.state.kycStats.approved }}</div>
        </div>
        <div class="stat-card">
          <div class="text-xs uppercase tracking-wider opacity-60">Rejected</div>
          <div class="text-3xl font-bold mt-1 text-red-400">{{ store.state.kycStats.rejected }}</div>
        </div>
        <div class="stat-card">
          <div class="text-xs uppercase tracking-wider opacity-60">Approval Rate</div>
          <div class="text-3xl font-bold mt-1 text-amber-400">{{ store.state.kycStats.approvalRate }}%</div>
        </div>
      </div>
  
      <!-- Filter Tabs -->
      <div class="flex gap-2 mb-4">
        <button
          v-for="s in ['pending', 'approved', 'rejected', 'all']"
          :key="s"
          @click="filterStatus = s; loadSubmissions()"
          :class="['filter-btn', filterStatus === s && 'active']"
        >
          {{ s }}
        </button>
      </div>
  
      <!-- Submissions Table -->
      <div v-if="store.state.isLoading" class="py-12 text-center">Loading...</div>
  
      <div v-else-if="store.state.kycSubmissions.length === 0" class="py-12 text-center opacity-60">
        No submissions
      </div>
  
      <div v-else class="space-y-3">
        <div
          v-for="user in store.state.kycSubmissions"
          :key="user._id"
          class="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
        >
          <img
            :src="user.avatar || '/default-avatar.png'"
            class="w-12 h-12 rounded-full object-cover"
          />
          <div class="flex-1 min-w-0">
            <div class="font-bold">{{ user.name }}</div>
            <div class="text-sm opacity-60">{{ user.email }}</div>
          </div>
          <div class="badge">{{ user.kyc?.documentType || 'N/A' }}</div>
          <div class="text-xs opacity-60">{{ formatDate(user.kyc?.submittedAt) }}</div>
  
          <button @click="viewKyc(user)" class="btn-outline">View</button>
          <button @click="approve(user)" class="btn-success">Approve</button>
          <button @click="reject(user)" class="btn-danger">Reject</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { toast } from 'vue-sonner'
  
  definePageMeta({
    layout: 'admin',
    middleware: 'admin',
  })
  
  const store = useAdminStore()
  const filterStatus = ref('pending')
  
  const loadSubmissions = async () => {
    const res = await store.fetchKycSubmissions({ status: filterStatus.value });
    if (!res.success) toast.error(res.message)
  }
  
  const approve = async (user) => {
    const toastId = toast.loading(`Approving KYC for ${user.name}...`)
    const res = await store.approveKyc(user._id)
    if (res.success) {
      toast.success('KYC approved', { id: toastId })
      store.fetchKycStats()
    } else {
      toast.error('Failed', { id: toastId, description: res.message })
    }
  }
  
  const reject = async (user) => {
    const reason = prompt(`Rejection reason for ${user.name}:`)
    if (!reason) return
  
    const toastId = toast.loading('Rejecting...')
    const res = await store.rejectKyc(user._id, reason)
    if (res.success) {
      toast.success('KYC rejected', { id: toastId })
      store.fetchKycStats()
    } else {
      toast.error('Failed', { id: toastId, description: res.message })
    }
  }
  
  const viewKyc = async (user) => {
    await store.fetchKycByUser(user._id)
    // open modal
  }
  
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—')
  
  onMounted(() => {
    loadSubmissions()
    store.fetchKycStats()
  })
  </script>