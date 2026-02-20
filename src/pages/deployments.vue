<script setup lang="ts">
import { ref, onMounted } from "vue";
import { deploymentApi } from "@/services/api";

interface Deployment {
  app_id: number;
  app_name: string;
  platform: string;
  version: string;
  status: string;
  deployed_at: string;
}

const deployments = ref<Deployment[]>([]);
const isLoading = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const statusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "success";
    case "Failed":
      return "error";
    case "Inactive":
      return "warning";
    default:
      return "default";
  }
};

const fetchDeployments = async () => {
  isLoading.value = true;
  try {
    const response = await deploymentApi.getDeployments();
    console.log("Deployments response:", response);
    deployments.value = response.data || [];
  } catch (error: any) {
    console.error("Failed to fetch deployments:", error);
    snackbarText.value = error.message;
    snackbarColor.value = "error";
    snackbar.value = true;
  } finally {
    isLoading.value = false;
  }
};

const search = ref("");

onMounted(() => {
  fetchDeployments();
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h1 class="mb-5">Deployments</h1>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>All Deployed Mobile Applications</span>
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
              <th>Platform</th>
              <th>Version</th>
              <th>Status</th>
              <th>Deployed At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="deployment in deployments" :key="deployment.app_id">
              <td>{{ deployment.app_name }}</td>
              <td>{{ deployment.platform }}</td>
              <td>
                <code>{{ deployment.version }}</code>
              </td>
              <td>
                <VChip :color="statusColor(deployment.status)" size="small">
                  {{ deployment.status }}
                </VChip>
              </td>
              <td>{{ deployment.deployed_at }}</td>
            </tr>
            <tr v-if="deployments.length === 0 && !isLoading">
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
