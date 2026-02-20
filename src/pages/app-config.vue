<script setup lang="ts">
import { ref, onMounted } from "vue";
import { deploymentApi } from "@/services/api";

interface AppConfig {
  id: number;
  company_name: string;
  company_id: string;
  app_name: string;
  platform: string;
  branding: {
    primary_color: string;
    secondary_color: string;
    background_color: string;
    surface_color: string;
    theme_mode: string;
    logo_url?: string;
  } | null;
  api_endpoint: string | null;
}

interface Company {
  id: number;
  name: string;
  company_id: string;
}

interface Deployment {
  app_id: number;
  app_name: string;
  platform: string;
}

const configs = ref<AppConfig[]>([]);
const companies = ref<Company[]>([]);
const deployments = ref<Deployment[]>([]);
const isLoading = ref(false);

const showCreateDialog = ref(false);
const newConfig = ref({
  company_id: null as number | null,
  app_id: null as number | null,
  platform: "",
  branding: {
    primaryColor: "#1976D2",
    secondaryColor: "#424242",
    backgroundColor: "#FFFFFF",
    surfaceColor: "#F5F5F5",
    themeMode: "system",
  },
  apiEndpoint: "",
});

const showBrandingDialog = ref(false);
const showApiEndpointDialog = ref(false);
const editingConfig = ref<AppConfig | null>(null);
const editBranding = ref({
  primaryColor: "#1976D2",
  secondaryColor: "#424242",
  backgroundColor: "#FFFFFF",
  surfaceColor: "#F5F5F5",
  themeMode: "system",
});
const editApiEndpoint = ref("");

const showDeleteDialog = ref(false);
const configToDelete = ref<AppConfig | null>(null);

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const fetchConfigs = async () => {
  isLoading.value = true;
  try {
    const response = await deploymentApi.getAppConfigs();
    configs.value = response.data || [];
  } catch (error: any) {
    snackbarText.value = error.message;
    snackbarColor.value = "error";
    snackbar.value = true;
  } finally {
    isLoading.value = false;
  }
};

const fetchCompanies = async () => {
  try {
    const response = await deploymentApi.getCompanies();
    companies.value = response.data || [];
  } catch (error) {
    companies.value = [];
  }
};

const fetchDeployments = async () => {
  try {
    const response = await deploymentApi.getDeployments();
    deployments.value = response.data || [];
  } catch (error) {
    deployments.value = [];
  }
};

const openCreateDialog = async () => {
  await fetchCompanies();
  await fetchDeployments();
  resetForm();
  showCreateDialog.value = true;
};

const resetForm = () => {
  newConfig.value = {
    company_id: null,
    app_id: null,
    platform: "",
    branding: {
      primaryColor: "#1976D2",
      secondaryColor: "#424242",
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F5F5F5",
      themeMode: "system",
    },
    apiEndpoint: "",
  };
};

const createConfig = async () => {
  try {
    await deploymentApi.createAppConfig({
      company_id: newConfig.value.company_id!,
      app_id: newConfig.value.app_id!,
      platform: newConfig.value.platform,
      branding: newConfig.value.branding,
      api_endpoint: newConfig.value.apiEndpoint || undefined,
    });
    showCreateDialog.value = false;
    resetForm();
    await fetchConfigs();
    snackbarText.value = "Configuration created successfully";
    snackbarColor.value = "success";
    snackbar.value = true;
  } catch (error: any) {
    snackbarText.value = error.message;
    snackbarColor.value = "error";
    snackbar.value = true;
  }
};

const openBrandingDialog = (config: AppConfig) => {
  editingConfig.value = config;
  editBranding.value = {
    primaryColor: config.branding?.primary_color || "#1976D2",
    secondaryColor: config.branding?.secondary_color || "#424242",
    backgroundColor: config.branding?.background_color || "#FFFFFF",
    surfaceColor: config.branding?.surface_color || "#F5F5F5",
    themeMode: config.branding?.theme_mode || "system",
  };
  showBrandingDialog.value = true;
};

const saveBranding = async () => {
  if (!editingConfig.value) return;
  try {
    await deploymentApi.updateAppConfigBranding(editingConfig.value.id, {
      primary_color: editBranding.value.primaryColor,
      secondary_color: editBranding.value.secondaryColor,
      background_color: editBranding.value.backgroundColor,
      surface_color: editBranding.value.surfaceColor,
      theme_mode: editBranding.value.themeMode,
    });
    showBrandingDialog.value = false;
    await fetchConfigs();
    snackbarText.value = "Branding updated successfully";
    snackbarColor.value = "success";
    snackbar.value = true;
  } catch (error: any) {
    snackbarText.value = error.message;
    snackbarColor.value = "error";
    snackbar.value = true;
  }
};

const openApiEndpointDialog = (config: AppConfig) => {
  editingConfig.value = config;
  editApiEndpoint.value = config.api_endpoint || "";
  showApiEndpointDialog.value = true;
};

const saveApiEndpoint = async () => {
  if (!editingConfig.value) return;
  try {
    await deploymentApi.updateAppConfigApiEndpoint(
      editingConfig.value.id,
      editApiEndpoint.value,
    );
    showApiEndpointDialog.value = false;
    await fetchConfigs();
    snackbarText.value = "API endpoint updated successfully";
    snackbarColor.value = "success";
    snackbar.value = true;
  } catch (error: any) {
    snackbarText.value = error.message;
    snackbarColor.value = "error";
    snackbar.value = true;
  }
};

const confirmDelete = (config: AppConfig) => {
  configToDelete.value = config;
  showDeleteDialog.value = true;
};

const deleteConfig = async () => {
  if (!configToDelete.value) return;
  try {
    await deploymentApi.deleteAppConfig(configToDelete.value.id);
    showDeleteDialog.value = false;
    await fetchConfigs();
    snackbarText.value = "Configuration deleted successfully";
    snackbarColor.value = "success";
    snackbar.value = true;
  } catch (error: any) {
    snackbarText.value = error.message;
    snackbarColor.value = "error";
    snackbar.value = true;
  } finally {
    configToDelete.value = null;
  }
};

onMounted(() => {
  fetchConfigs();
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h1 class="mb-5">App Configurations</h1>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>App Configurations</span>
          <VBtn color="primary" @click="openCreateDialog">
            Create Configuration
          </VBtn>
        </VCardTitle>

        <VTable>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Company ID</th>
              <th>App Name</th>
              <th>Platform</th>
              <th>Branding</th>
              <th>API Endpoint</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="config in configs" :key="config.id">
              <td>{{ config.company_name }}</td>
              <td>{{ config.company_id }}</td>
              <td>{{ config.app_name }}</td>
              <td>{{ config.platform }}</td>
              <td>
                <VBtn
                  size="small"
                  variant="tonal"
                  color="primary"
                  @click="openBrandingDialog(config)"
                >
                  <VIcon icon="ri-palette-line" class="mr-1" />
                  View/Edit
                </VBtn>
              </td>
              <td>
                <VBtn
                  size="small"
                  variant="tonal"
                  color="primary"
                  @click="openApiEndpointDialog(config)"
                >
                  <VIcon icon="ri-link" class="mr-1" />
                  View/Edit
                </VBtn>
              </td>
              <td>
                <VBtn
                  icon
                  size="small"
                  variant="text"
                  color="error"
                  @click="confirmDelete(config)"
                >
                  <VIcon icon="ri-delete-bin-line" />
                </VBtn>
              </td>
            </tr>
            <tr v-if="configs.length === 0 && !isLoading">
              <td colspan="7" class="text-center text-grey">
                No configurations found
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>

    <VDialog v-model="showCreateDialog" max-width="700" persistent>
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>Create App Configuration</span>
          <VBtn
            icon
            variant="text"
            size="small"
            @click="showCreateDialog = false"
          >
            <VIcon icon="ri-close-line" />
          </VBtn>
        </VCardTitle>

        <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <VSelect
                v-model="newConfig.company_id"
                label="Select Company"
                :items="companies"
                item-title="name"
                item-value="id"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VSelect
                v-model="newConfig.app_id"
                label="Select App"
                :items="deployments"
                item-title="app_name"
                item-value="app_id"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VSelect
                v-model="newConfig.platform"
                label="Platform"
                :items="['ios', 'android', 'web']"
              />
            </VCol>
          </VRow>

          <VExpansionPanels class="mt-4">
            <VExpansionPanel title="Branding (Optional)">
              <VExpansionPanelText>
                <VRow>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="newConfig.branding.primaryColor"
                      label="Primary Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="newConfig.branding.secondaryColor"
                      label="Secondary Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="newConfig.branding.backgroundColor"
                      label="Background Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="newConfig.branding.surfaceColor"
                      label="Surface Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="12" md="8">
                    <VSelect
                      v-model="newConfig.branding.themeMode"
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
                  v-model="newConfig.apiEndpoint"
                  label="API Endpoint"
                  placeholder="https://api.example.com"
                />
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="showCreateDialog = false"> Cancel </VBtn>
          <VBtn
            color="primary"
            @click="createConfig"
            :disabled="
              !newConfig.company_id || !newConfig.app_id || !newConfig.platform
            "
          >
            Create
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="showBrandingDialog" max-width="500" persistent>
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>Edit Branding</span>
          <VBtn
            icon
            variant="text"
            size="small"
            @click="showBrandingDialog = false"
          >
            <VIcon icon="ri-close-line" />
          </VBtn>
        </VCardTitle>

        <VCardText>
          <VRow>
            <VCol cols="6" md="4">
              <VTextField
                v-model="editBranding.primaryColor"
                label="Primary Color"
                type="color"
                density="compact"
              />
            </VCol>
            <VCol cols="6" md="4">
              <VTextField
                v-model="editBranding.secondaryColor"
                label="Secondary Color"
                type="color"
                density="compact"
              />
            </VCol>
            <VCol cols="6" md="4">
              <VTextField
                v-model="editBranding.backgroundColor"
                label="Background Color"
                type="color"
                density="compact"
              />
            </VCol>
            <VCol cols="6" md="4">
              <VTextField
                v-model="editBranding.surfaceColor"
                label="Surface Color"
                type="color"
                density="compact"
              />
            </VCol>
            <VCol cols="12" md="8">
              <VSelect
                v-model="editBranding.themeMode"
                label="Theme Mode"
                :items="[
                  { title: 'System', value: 'system' },
                  { title: 'Light', value: 'light' },
                  { title: 'Dark', value: 'dark' },
                ]"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="showBrandingDialog = false">
            Cancel
          </VBtn>
          <VBtn color="primary" @click="saveBranding"> Save </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="showApiEndpointDialog" max-width="500" persistent>
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>Edit API Endpoint</span>
          <VBtn
            icon
            variant="text"
            size="small"
            @click="showApiEndpointDialog = false"
          >
            <VIcon icon="ri-close-line" />
          </VBtn>
        </VCardTitle>

        <VCardText>
          <VTextField
            v-model="editApiEndpoint"
            label="API Endpoint"
            placeholder="https://api.example.com"
          />
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="showApiEndpointDialog = false">
            Cancel
          </VBtn>
          <VBtn color="primary" @click="saveApiEndpoint"> Save </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="showDeleteDialog" max-width="500" persistent>
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-alert-line" class="mr-2" color="error" />
          Delete Configuration
        </VCardTitle>
        <VCardText>
          <VAlert type="error" variant="tonal" class="mb-4">
            <strong>Warning:</strong> You are about to delete the configuration
            for <strong>{{ configToDelete?.app_name }}</strong> under
            <strong>{{ configToDelete?.company_name }}</strong
            >.
          </VAlert>
          <p class="text-body-2 text-grey">This action cannot be undone.</p>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="showDeleteDialog = false"> Cancel </VBtn>
          <VBtn color="error" @click="deleteConfig"> Delete </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VSnackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
    </VSnackbar>
  </VRow>
</template>
