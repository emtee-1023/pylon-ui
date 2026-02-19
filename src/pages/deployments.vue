<script setup lang="ts">
import { ref } from 'vue'

const deployments = ref([
  { id: 1, appName: 'Mobile App v1', environment: 'Production', status: 'Active', version: '1.0.0', deployedAt: '2024-02-01 10:30' },
  { id: 2, appName: 'Mobile App v1', environment: 'Staging', status: 'Active', version: '1.0.1-beta', deployedAt: '2024-01-28 15:45' },
  { id: 3, appName: 'Mobile App v1', environment: 'Development', status: 'Failed', version: '1.0.2-dev', deployedAt: '2024-01-25 09:00' },
  { id: 4, appName: 'Mobile App v2', environment: 'Production', status: 'Active', version: '2.0.0', deployedAt: '2024-01-20 14:20' },
  { id: 5, appName: 'Mobile App v2', environment: 'Staging', status: 'Inactive', version: '2.1.0-beta', deployedAt: '2024-01-15 11:10' },
])

const statusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'success'
    case 'Failed': return 'error'
    case 'Inactive': return 'warning'
    default: return 'default'
  }
}

const search = ref('')
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h1 class="mb-5">Deployments</h1>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>All Deployments</span>
          <VTextField
            v-model="search"
            label="Search"
            prepend-inner-icon="ri-search-line"
            style="max-width: 300px"
            density="compact"
          />
        </VCardTitle>

        <VTable>
          <thead>
            <tr>
              <th>App Name</th>
              <th>Environment</th>
              <th>Version</th>
              <th>Status</th>
              <th>Deployed At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="deployment in deployments"
              :key="deployment.id"
            >
              <td>{{ deployment.appName }}</td>
              <td>{{ deployment.environment }}</td>
              <td><code>{{ deployment.version }}</code></td>
              <td>
                <VChip
                  :color="statusColor(deployment.status)"
                  size="small"
                >
                  {{ deployment.status }}
                </VChip>
              </td>
              <td>{{ deployment.deployedAt }}</td>
              <td>
                <VBtn
                  icon
                  size="small"
                  variant="text"
                >
                  <VIcon icon="ri-eye-line" />
                </VBtn>
                <VBtn
                  icon
                  size="small"
                  variant="text"
                >
                  <VIcon icon="ri-restart-line" />
                </VBtn>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
  </VRow>
</template>
