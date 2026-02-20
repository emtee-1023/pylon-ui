<script setup lang="ts">
import { ref, onMounted } from "vue";
import { deploymentApi } from "@/services/api";

interface Deployment {
  id: number;
  app_name: string;
  platform: string;
  version: string;
  status: string;
  deployed_at: string;
}

const stats = ref([
  {
    title: "Total Deployments",
    value: "0",
    icon: "ri-rocket-line",
    color: "primary",
  },
]);

const recentDeployments = ref<Deployment[]>([]);
const isLoading = ref(false);

const fetchDeployments = async () => {
  isLoading.value = true;
  try {
    const response = await deploymentApi.getDeployments();
    recentDeployments.value = response.data || [];
    stats.value[0].value = String(recentDeployments.value.length);
  } catch (error) {
    // Handle error silently
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDeployments();
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h1 class="mb-5">Dashboard</h1>
    </VCol>

    <VCol v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
      <VCard>
        <VCardText class="d-flex align-center">
          <VAvatar :color="stat.color" variant="tonal" size="48">
            <VIcon :icon="stat.icon" />
          </VAvatar>
          <div class="ml-4">
            <h3 class="text-h5 mb-0">{{ stat.value }}</h3>
            <span class="text-caption">{{ stat.title }}</span>
          </div>
          <VSpacer />
          <!-- <span
            class="text-caption"
            :class="
              stat.change.startsWith('+')
                ? 'text-success'
                : stat.change.startsWith('-')
                  ? 'text-error'
                  : ''
            "
          >
            {{ stat.change }}
          </span> -->
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardTitle>Deployed Mobile Applications</VCardTitle>
        <VTable>
          <thead>
            <tr>
              <th>App Name</th>
              <th>Platform</th>
              <th>Version</th>
              <th>Status</th>
              <th>Deployed</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="deployment in recentDeployments" :key="deployment.id">
              <td>{{ deployment.app_name }}</td>
              <td>{{ deployment.platform }}</td>
              <td>{{ deployment.version }}</td>
              <td>
                <VChip
                  :color="deployment.status === 'Active' ? 'success' : 'error'"
                  size="small"
                >
                  {{ deployment.status }}
                </VChip>
              </td>
              <td>{{ deployment.deployed_at }}</td>
            </tr>
            <tr v-if="recentDeployments.length === 0 && !isLoading">
              <td colspan="5" class="text-center text-grey">
                No deployments found
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
  </VRow>
</template>
