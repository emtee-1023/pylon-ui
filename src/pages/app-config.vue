<script setup lang="ts">
import { ref, onMounted } from "vue";
import { deploymentApi } from "@/services/api";

interface AppConfig {
  id: number;
  company_name: string;
  company_id: string;
  companyDbId: number;
  app_name: string;
  appDbId: number;
  platform: string;
  branding: {
    primary_color_light: string;
    primary_color_dark: string;
    secondary_color_light: string;
    secondary_color_dark: string;
    background_color_light: string;
    background_color_dark: string;
    surface_color_light: string;
    surface_color_dark: string;
    text_color_light: string;
    text_color_dark: string;
    default_theme_mode: string;
    logo_url?: string;
  } | null;
  api_config: {
    endpoint: string;
  } | null;
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
  branding: {
    themeMode: "system",
    logoUrl: "",
    light: {
      primaryColor: "#1976D2",
      secondaryColor: "#424242",
      surfaceColor: "#F5F5F5",
      backgroundColor: "#FFFFFF",
      textColor: "#000000",
    },
    dark: {
      primaryColor: "#1976D2",
      secondaryColor: "#424242",
      surfaceColor: "#2D2D2D",
      backgroundColor: "#1E1E1E",
      textColor: "#FFFFFF",
    },
  },
  api_config: {
    endpoint: "",
  },
});

const showBrandingDialog = ref(false);
const showApiEndpointDialog = ref(false);
const editingConfig = ref<AppConfig | null>(null);
const editBranding = ref({
  themeMode: "system",
  logoUrl: "",
  light: {
    primaryColor: "#1976D2",
    secondaryColor: "#424242",
    backgroundColor: "#FFFFFF",
    surfaceColor: "#F5F5F5",
    textColor: "#000000",
  },
  dark: {
    primaryColor: "#1976D2",
    secondaryColor: "#424242",
    backgroundColor: "#1E1E1E",
    surfaceColor: "#2D2D2D",
    textColor: "#FFFFFF",
  },
});
const editApiEndpoint = ref("");

const showDeleteDialog = ref(false);
const configToDelete = ref<AppConfig | null>(null);

const showQrCodeDialog = ref(false);
const qrCodeData = ref("");
const qrCodeConfig = ref<AppConfig | null>(null);
const isLoadingQrCode = ref(false);

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
    branding: {
      themeMode: "system",
      logoUrl: "",
      light: {
        primaryColor: "#1976D2",
        secondaryColor: "#424242",
        surfaceColor: "#F5F5F5",
        backgroundColor: "#FFFFFF",
        textColor: "#000000",
      },
      dark: {
        primaryColor: "#1976D2",
        secondaryColor: "#424242",
        surfaceColor: "#2D2D2D",
        backgroundColor: "#1E1E1E",
        textColor: "#FFFFFF",
      },
    },
    api_config: {
      endpoint: "",
    },
  };
};

const createConfig = async () => {
  try {
    await deploymentApi.createAppConfig({
      company_id: newConfig.value.company_id!,
      app_id: newConfig.value.app_id!,
      primary_color_light: newConfig.value.branding.light.primaryColor,
      primary_color_dark: newConfig.value.branding.dark.primaryColor,
      secondary_color_light: newConfig.value.branding.light.secondaryColor,
      secondary_color_dark: newConfig.value.branding.dark.secondaryColor,
      surface_color_light: newConfig.value.branding.light.surfaceColor,
      surface_color_dark: newConfig.value.branding.dark.surfaceColor,
      background_color_light: newConfig.value.branding.light.backgroundColor,
      background_color_dark: newConfig.value.branding.dark.backgroundColor,
      text_color_light: newConfig.value.branding.light.textColor,
      text_color_dark: newConfig.value.branding.dark.textColor,
      default_theme_mode: newConfig.value.branding.themeMode,
      logo_url: newConfig.value.branding.logoUrl,
      api_endpoint: newConfig.value.api_config.endpoint,
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
  const company = companies.value.find(
    (c) => c.company_id === config.company_id,
  );
  const deployment = deployments.value.find(
    (d) => d.app_name === config.app_name,
  );
  editingConfig.value = {
    ...config,
    companyDbId: company?.id || 0,
    appDbId: deployment?.app_id || 0,
  };
  editBranding.value = {
    themeMode: config.branding?.default_theme_mode || "system",
    logoUrl: config.branding?.logo_url || "",
    light: {
      primaryColor: config.branding?.primary_color_light || "#1976D2",
      secondaryColor: config.branding?.secondary_color_light || "#424242",
      backgroundColor: config.branding?.background_color_light || "#FFFFFF",
      surfaceColor: config.branding?.surface_color_light || "#F5F5F5",
      textColor: config.branding?.text_color_light || "#000000",
    },
    dark: {
      primaryColor: config.branding?.primary_color_dark || "#1976D2",
      secondaryColor: config.branding?.secondary_color_dark || "#424242",
      backgroundColor: config.branding?.background_color_dark || "#1E1E1E",
      surfaceColor: config.branding?.surface_color_dark || "#2D2D2D",
      textColor: config.branding?.text_color_dark || "#FFFFFF",
    },
  };
  showBrandingDialog.value = true;
};

const saveBranding = async () => {
  if (!editingConfig.value) return;
  try {
    await deploymentApi.updateAppConfig(editingConfig.value.id, {
      company_id: editingConfig.value.companyDbId,
      app_id: editingConfig.value.appDbId,
      primary_color_light: editBranding.value.light.primaryColor,
      primary_color_dark: editBranding.value.dark.primaryColor,
      secondary_color_light: editBranding.value.light.secondaryColor,
      secondary_color_dark: editBranding.value.dark.secondaryColor,
      background_color_light: editBranding.value.light.backgroundColor,
      background_color_dark: editBranding.value.dark.backgroundColor,
      surface_color_light: editBranding.value.light.surfaceColor,
      surface_color_dark: editBranding.value.dark.surfaceColor,
      text_color_light: editBranding.value.light.textColor,
      text_color_dark: editBranding.value.dark.textColor,
      default_theme_mode: editBranding.value.themeMode,
      logo_url: editBranding.value.logoUrl,
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
  const company = companies.value.find(
    (c) => c.company_id === config.company_id,
  );
  const deployment = deployments.value.find(
    (d) => d.app_name === config.app_name,
  );
  editingConfig.value = {
    ...config,
    companyDbId: company?.id || 0,
    appDbId: deployment?.app_id || 0,
  };
  editApiEndpoint.value = config.api_config?.endpoint || "";
  showApiEndpointDialog.value = true;
};

const saveApiEndpoint = async () => {
  if (!editingConfig.value) return;
  try {
    await deploymentApi.updateAppConfig(editingConfig.value.id, {
      company_id: editingConfig.value.companyDbId,
      app_id: editingConfig.value.appDbId,
      api_endpoint: editApiEndpoint.value,
    });
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
  const company = companies.value.find(
    (c) => c.company_id === config.company_id,
  );
  const deployment = deployments.value.find(
    (d) => d.app_name === config.app_name,
  );
  configToDelete.value = {
    ...config,
    companyDbId: company?.id || 0,
    appDbId: deployment?.app_id || 0,
  };
  showDeleteDialog.value = true;
};

const deleteConfig = async () => {
  if (!configToDelete.value) return;
  try {
    await deploymentApi.deleteAppConfig(
      configToDelete.value.id,
      configToDelete.value.companyDbId,
      configToDelete.value.appDbId,
    );
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

const openQrCodeDialog = async (config: AppConfig) => {
  const company = companies.value.find(
    (c) => c.company_id === config.company_id,
  );
  const deployment = deployments.value.find(
    (d) => d.app_name === config.app_name,
  );
  qrCodeConfig.value = {
    ...config,
    companyDbId: company?.id || 0,
    appDbId: deployment?.app_id || 0,
  };
  showQrCodeDialog.value = true;
  isLoadingQrCode.value = true;
  qrCodeData.value = "";
  try {
    const response = await deploymentApi.getAppConfigQrCode(
      qrCodeConfig.value.companyDbId,
      qrCodeConfig.value.appDbId,
    );
    qrCodeData.value = response.qr_code;
  } catch (error: any) {
    snackbarText.value = error.message;
    snackbarColor.value = "error";
    snackbar.value = true;
  } finally {
    isLoadingQrCode.value = false;
  }
};

const printQrCode = () => {
  const printWindow = window.open("", "_blank");
  if (!printWindow || !qrCodeData.value) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>QR Code - ${qrCodeConfig.value?.app_name}</title>
        <style>
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
          }
          h2 { margin-bottom: 20px; }
          img { max-width: 300px; }
        </style>
      </head>
      <body>
        <h2>${qrCodeConfig.value?.app_name} App Configuration - ${qrCodeConfig.value?.company_name}</h2>
        <img src="${qrCodeData.value}" alt="QR Code" />
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};

onMounted(() => {
  fetchConfigs();
  fetchCompanies();
  fetchDeployments();
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
              <th>QR Code</th>
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
                  size="small"
                  variant="tonal"
                  color="primary"
                  @click="openQrCodeDialog(config)"
                >
                  <VIcon icon="ri-qr-code-line" class="mr-1" />
                  View
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
              <td colspan="8" class="text-center text-grey">
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
          </VRow>

          <VExpansionPanels class="mt-4">
            <VExpansionPanel title="Company Settings (Optional)">
              <VExpansionPanelText>
                <VRow>
                  <VCol cols="12" md="8">
                    <VTextField
                      v-model="newConfig.branding.logoUrl"
                      label="Logo URL"
                      placeholder="https://example.com/logo.png"
                    />
                  </VCol>
                  <VCol cols="12" md="4">
                    <VSelect
                      v-model="newConfig.branding.themeMode"
                      label="Default Theme Mode"
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

            <VExpansionPanel title="Color Scheme (Light Mode)">
              <VExpansionPanelText>
                <VRow>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="newConfig.branding.light.primaryColor"
                      label="Primary Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="newConfig.branding.light.secondaryColor"
                      label="Secondary Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="newConfig.branding.light.backgroundColor"
                      label="Background Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="newConfig.branding.light.surfaceColor"
                      label="Surface Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="newConfig.branding.light.textColor"
                      label="Text Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                </VRow>
              </VExpansionPanelText>
            </VExpansionPanel>

            <VExpansionPanel title="Color Scheme (Dark Mode)">
              <VExpansionPanelText>
                <VRow>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="newConfig.branding.dark.primaryColor"
                      label="Primary Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="newConfig.branding.dark.secondaryColor"
                      label="Secondary Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="newConfig.branding.dark.backgroundColor"
                      label="Background Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="newConfig.branding.dark.surfaceColor"
                      label="Surface Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="newConfig.branding.dark.textColor"
                      label="Text Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                </VRow>
              </VExpansionPanelText>
            </VExpansionPanel>

            <VExpansionPanel title="API Endpoint">
              <VExpansionPanelText>
                <VTextField
                  v-model="newConfig.api_config.endpoint"
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
            :disabled="!newConfig.company_id || !newConfig.app_id"
          >
            Create
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="showBrandingDialog" max-width="700" persistent>
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
          <VExpansionPanels>
            <VExpansionPanel title="Branding">
              <VExpansionPanelText>
                <VRow>
                  <VCol cols="12" md="8">
                    <VTextField
                      v-model="editBranding.logoUrl"
                      label="Logo URL"
                      placeholder="https://example.com/logo.png"
                    />
                  </VCol>
                  <VCol cols="12" md="4">
                    <VSelect
                      v-model="editBranding.themeMode"
                      label="Default Theme Mode"
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

            <VExpansionPanel title="Colors (Light)">
              <VExpansionPanelText>
                <VRow>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="editBranding.light.primaryColor"
                      label="Primary Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="editBranding.light.secondaryColor"
                      label="Secondary Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="editBranding.light.backgroundColor"
                      label="Background Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="editBranding.light.surfaceColor"
                      label="Surface Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="editBranding.light.textColor"
                      label="Text Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                </VRow>
              </VExpansionPanelText>
            </VExpansionPanel>

            <VExpansionPanel title="Colors (Dark)">
              <VExpansionPanelText>
                <VRow>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="editBranding.dark.primaryColor"
                      label="Primary Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="editBranding.dark.secondaryColor"
                      label="Secondary Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="editBranding.dark.backgroundColor"
                      label="Background Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="editBranding.dark.surfaceColor"
                      label="Surface Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="6" md="4">
                    <VTextField
                      v-model="editBranding.dark.textColor"
                      label="Text Color"
                      type="color"
                      density="compact"
                    />
                  </VCol>
                </VRow>
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
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

    <VDialog v-model="showQrCodeDialog" max-width="400" persistent>
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>QR Code</span>
          <VBtn
            icon
            variant="text"
            size="small"
            @click="showQrCodeDialog = false"
          >
            <VIcon icon="ri-close-line" />
          </VBtn>
        </VCardTitle>

        <VCardText class="text-center">
          <p class="mb-4">
            Scan this QR code to configure
            <strong>{{ qrCodeConfig?.app_name }}</strong> for
            <strong>{{ qrCodeConfig?.company_name }}</strong>
          </p>
          <VProgressCircular
            v-if="isLoadingQrCode"
            indeterminate
            color="primary"
          />
          <div v-else-if="qrCodeData" class="qr-code-container">
            <img
              :src="qrCodeData"
              alt="QR Code"
              style="max-width: 100%; height: auto"
            />
          </div>
          <p v-else class="text-grey">Failed to load QR code</p>
        </VCardText>

        <VCardActions>
          <VBtn
            v-if="qrCodeData"
            variant="text"
            color="primary"
            @click="printQrCode"
          >
            <VIcon icon="ri-printer-line" class="mr-1" />
            Print
          </VBtn>
          <VSpacer />
          <VBtn variant="text" @click="showQrCodeDialog = false"> Close </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VSnackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
    </VSnackbar>
  </VRow>
</template>
