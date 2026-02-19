<script setup lang="ts">
import { ref } from 'vue'

const stats = ref([
  { title: 'Total Deployments', value: '24', change: '+12%', icon: 'ri-rocket-line', color: 'primary' },
  { title: 'Active API Keys', value: '8', change: '+2', icon: 'ri-key-line', color: 'success' },
  { title: 'App Configurations', value: '3', change: '0', icon: 'ri-settings-3-line', color: 'warning' },
  { title: 'Failed Deployments', value: '2', change: '-1', icon: 'ri-error-warning-line', color: 'error' },
])

const recentDeployments = ref([
  { id: 1, appName: 'Mobile App', env: 'Production', status: 'Active', time: '2 hours ago' },
  { id: 2, appName: 'Mobile App', env: 'Staging', status: 'Active', time: '5 hours ago' },
  { id: 3, appName: 'Mobile App', env: 'Development', status: 'Failed', time: '1 day ago' },
])
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h1 class="mb-5">Dashboard</h1>
    </VCol>

    <VCol
      v-for="stat in stats"
      :key="stat.title"
      cols="12"
      sm="6"
      md="3"
    >
      <VCard>
        <VCardText class="d-flex align-center">
          <VAvatar
            :color="stat.color"
            variant="tonal"
            size="48"
          >
            <VIcon :icon="stat.icon" />
          </VAvatar>
          <div class="ml-4">
            <h3 class="text-h5 mb-0">{{ stat.value }}</h3>
            <span class="text-caption">{{ stat.title }}</span>
          </div>
          <VSpacer />
          <span
            class="text-caption"
            :class="stat.change.startsWith('+') ? 'text-success' : stat.change.startsWith('-') ? 'text-error' : ''"
          >
            {{ stat.change }}
          </span>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardTitle>Recent Deployments</VCardTitle>
        <VTable>
          <thead>
            <tr>
              <th>App Name</th>
              <th>Environment</th>
              <th>Status</th>
              <th>Deployed</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="deployment in recentDeployments"
              :key="deployment.id"
            >
              <td>{{ deployment.appName }}</td>
              <td>{{ deployment.env }}</td>
              <td>
                <VChip
                  :color="deployment.status === 'Active' ? 'success' : 'error'"
                  size="small"
                >
                  {{ deployment.status }}
                </VChip>
              </td>
              <td>{{ deployment.time }}</td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
  </VRow>
</template>
