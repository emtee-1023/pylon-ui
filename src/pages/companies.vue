<script setup lang="ts">
import { ref, onMounted } from "vue";
import { deploymentApi } from "@/services/api";

interface Company {
  id: number;
  name: string;
  company_id: string;
  branding: any[] | null;
  api_config: any[] | null;
  created_at: string | null;
  updated_at: string | null;
  linked_apps: string[] | null;
}

interface Deployment {
  app_id: number;
  app_name: string | null;
}

const companies = ref<Company[]>([]);
const availableApps = ref<{ title: string; value: number }[]>([]);
const isLoading = ref(false);

const showCreateDialog = ref(false);
const createStep = ref(1);
const newCompanyName = ref("");
const selectedAppId = ref<number | null>(null);
const branding = ref({
  primaryColor: "#1976D2",
  secondaryColor: "#424242",
  backgroundColor: "#FFFFFF",
  surfaceColor: "#F5F5F5",
  logoUrl: "",
  themeMode: "system",
});
const apiEndpoint = ref("");

const fetchCompanies = async () => {
  isLoading.value = true;
  try {
    const response = await deploymentApi.getCompanies();
    companies.value = response.data || [];
  } catch (error) {
    // Handle error silently
  } finally {
    isLoading.value = false;
  }
};

const fetchAvailableApps = async () => {
  try {
    const response = await deploymentApi.getDeployments();
    const deployments: Deployment[] = response.data || [];
    const uniqueApps = deployments.filter(
      (d, index, self) =>
        index === self.findIndex((t) => t.app_name === d.app_name),
    );
    availableApps.value = uniqueApps.map((d) => ({
      title: d.app_name!,
      value: d.app_id,
    }));
  } catch (error) {
    availableApps.value = [];
  }
};

const resetForm = () => {
  createStep.value = 1;
  newCompanyName.value = "";
  selectedAppId.value = null;
  branding.value = {
    primaryColor: "#1976D2",
    secondaryColor: "#424242",
    backgroundColor: "#FFFFFF",
    surfaceColor: "#F5F5F5",
    logoUrl: "",
    themeMode: "system",
  };
  apiEndpoint.value = "";
};

const goToStep2 = async () => {
  if (newCompanyName.value.trim()) {
    await fetchAvailableApps();
    createStep.value = 2;
  }
};

const createCompany = async () => {
  try {
    await deploymentApi.createCompany({
      company_name: newCompanyName.value,
      app_id: Number(selectedAppId.value),
      primary_color: branding.value.primaryColor || undefined,
      secondary_color: branding.value.secondaryColor || undefined,
      background_color: branding.value.backgroundColor || undefined,
      surface_color: branding.value.surfaceColor || undefined,
      theme_mode: branding.value.themeMode || undefined,
      api_endpoint: apiEndpoint.value || undefined,
    });
    showCreateDialog.value = false;
    resetForm();
    await fetchCompanies();
  } catch (error: any) {
    // Handle error silently
  }
};

onMounted(() => {
  fetchCompanies();
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h1 class="mb-5">Companies</h1>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>Companies</span>
          <VBtn color="primary" @click="showCreateDialog = true">
            Create Company
          </VBtn>
        </VCardTitle>

        <VTable>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Company ID</th>
              <th>Linked Apps</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="company in companies" :key="company.id">
              <td>{{ company.name }}</td>
              <td>{{ company.company_id }}</td>
              <td>
                <VChip
                  v-for="(app, idx) in (company.linked_apps || []).slice(0, 3)"
                  :key="idx"
                  size="small"
                  class="mr-1 mb-1"
                >
                  {{ app }}
                </VChip>
              </td>
              <td>
                <VBtn icon size="small" variant="text" color="error">
                  <VIcon icon="ri-delete-bin-line" />
                </VBtn>
              </td>
            </tr>
            <tr v-if="companies.length === 0 && !isLoading">
              <td colspan="4" class="text-center text-grey">
                No companies found
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>

    <VDialog v-model="showCreateDialog" max-width="600" persistent>
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>Create Company - Step {{ createStep }}/2</span>
          <VBtn
            icon
            variant="text"
            size="small"
            @click="
              showCreateDialog = false;
              resetForm();
            "
          >
            <VIcon icon="ri-close-line" />
          </VBtn>
        </VCardTitle>

        <VCardText style="min-height: 300px">
          <div v-if="createStep === 1">
            <VTextField
              v-model="newCompanyName"
              label="Company Name"
              placeholder="e.g., Acme Corp"
              autofocus
              @keyup.enter="goToStep2"
            />
          </div>

          <div v-else>
            <VSelect
              v-model="selectedAppId"
              label="Select App"
              :items="availableApps"
              item-title="title"
              item-value="value"
              class="mb-4"
            />

            <VExpansionPanels>
              <VExpansionPanel title="Branding (Optional)">
                <VExpansionPanelText>
                  <VRow>
                    <VCol cols="6" md="4">
                      <VTextField
                        v-model="branding.primaryColor"
                        label="Primary Color"
                        type="color"
                        density="compact"
                      />
                    </VCol>
                    <VCol cols="6" md="4">
                      <VTextField
                        v-model="branding.secondaryColor"
                        label="Secondary Color"
                        type="color"
                        density="compact"
                      />
                    </VCol>
                    <VCol cols="6" md="4">
                      <VTextField
                        v-model="branding.backgroundColor"
                        label="Background Color"
                        type="color"
                        density="compact"
                      />
                    </VCol>
                    <VCol cols="6" md="4">
                      <VTextField
                        v-model="branding.surfaceColor"
                        label="Surface Color"
                        type="color"
                        density="compact"
                      />
                    </VCol>
                    <VCol cols="12" md="8">
                      <VTextField
                        v-model="branding.logoUrl"
                        label="Logo URL"
                        placeholder="https://example.com/logo.png"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VSelect
                        v-model="branding.themeMode"
                        label="Theme Mode"
                        :items="[
                          { title: 'System', value: 'system' },
                          { title: 'Light', value: 'light' },
                          { title: 'Dark', value: 'dark' },
                        ]"
                      />
                    </VCol>
                  </VRow>
                </VExpansionPanelText>
              </VExpansionPanel>

              <VExpansionPanel title="API Endpoint">
                <VExpansionPanelText>
                  <VTextField
                    v-model="apiEndpoint"
                    label="API Endpoint"
                    placeholder="https://api.example.com"
                  />
                </VExpansionPanelText>
              </VExpansionPanel>
            </VExpansionPanels>
          </div>
        </VCardText>

        <VCardActions>
          <VBtn v-if="createStep === 2" variant="text" @click="createStep = 1">
            Back
          </VBtn>
          <VSpacer />
          <VBtn
            variant="text"
            @click="
              showCreateDialog = false;
              resetForm();
            "
          >
            Cancel
          </VBtn>
          <VBtn v-if="createStep === 1" color="primary" @click="goToStep2">
            Next
          </VBtn>
          <VBtn
            v-else
            color="primary"
            @click="createCompany"
            :disabled="!selectedAppId"
          >
            Create
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>
</template>
