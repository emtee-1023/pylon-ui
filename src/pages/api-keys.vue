<script setup lang="ts">
import { ref, onMounted } from "vue";
import { deploymentApi } from "@/services/api";

interface ApiKey {
  api_key_id: number | string;
  app_name: string | null;
  key_hash: string;
  scopes: string[] | null;
  status: boolean;
  last_used_at: string | null;
  generated_at: string | null;
  updated_at: string | null;
}

const apiKeys = ref<ApiKey[]>([]);
const isLoading = ref(false);

const showCreateDialog = ref(false);
const newKeyName = ref("");
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const showKeyDialog = ref(false);
const rawApiKey = ref("");
const confirmedStored = ref(false);

const showDeleteDialog = ref(false);
const keyToDelete = ref<{ id: any; app_name: string | null } | null>(null);

const fetchApiKeys = async () => {
  isLoading.value = true;
  try {
    const response = await deploymentApi.getApiKeys();
    apiKeys.value = response.data || [];
  } catch (error: any) {
    snackbarText.value = error.message;
    snackbarColor.value = "error";
    snackbar.value = true;
  } finally {
    isLoading.value = false;
  }
};

const createKey = async () => {
  try {
    const response = await deploymentApi.generateApiKey(newKeyName.value, [
      "config:read",
    ]);
    showCreateDialog.value = false;
    newKeyName.value = "";
    rawApiKey.value = response.data?.api_key || "";
    confirmedStored.value = false;
    showKeyDialog.value = true;
    await fetchApiKeys();
  } catch (error: any) {
    snackbarText.value = error.message;
    snackbarColor.value = "error";
    snackbar.value = true;
  }
};

const copyApiKey = () => {
  navigator.clipboard.writeText(rawApiKey.value);
  snackbarText.value = "API key copied to clipboard";
  snackbarColor.value = "success";
  snackbar.value = true;
};

const closeKeyDialog = () => {
  showKeyDialog.value = false;
  rawApiKey.value = "";
  confirmedStored.value = false;
};

const confirmDelete = (id: any, appName: string | null) => {
  keyToDelete.value = { id, app_name: appName };
  showDeleteDialog.value = true;
};

const deleteKey = async () => {
  if (!keyToDelete.value) return;

  const id = keyToDelete.value.id;
  if (id === undefined || id === null) {
    snackbarText.value = "Cannot delete: ID is undefined";
    snackbarColor.value = "error";
    snackbar.value = true;
    showDeleteDialog.value = false;
    return;
  }
  try {
    await deploymentApi.deleteApiKey(String(id));
    await fetchApiKeys();
    snackbarText.value = "API key deleted successfully";
    snackbarColor.value = "success";
    snackbar.value = true;
  } catch (error: any) {
    snackbarText.value = error.message;
    snackbarColor.value = "error";
    snackbar.value = true;
  } finally {
    showDeleteDialog.value = false;
    keyToDelete.value = null;
  }
};

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};

onMounted(() => {
  fetchApiKeys();
});
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <h1 class="mb-5">API Keys</h1>
      </VCol>

      <VCol cols="12">
        <VCard>
          <VCardTitle class="d-flex justify-space-between align-center">
            <span>API Keys</span>
            <VBtn color="primary" @click="showCreateDialog = true">
              Create API Key
            </VBtn>
          </VCardTitle>

          <VTable>
            <thead>
              <tr>
                <th>App Name</th>
                <th>Generated</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(key, index) in apiKeys"
                :key="key.api_key_id ?? index"
              >
                <td>{{ key.app_name || "-" }}</td>
                <td>
                  {{
                    formatDate(
                      key.last_used_at || key.generated_at || key.updated_at,
                    )
                  }}
                </td>
                <td>
                  <VChip :color="key.status ? 'success' : 'error'" size="small">
                    {{ key.status ? "Active" : "Inactive" }}
                  </VChip>
                </td>
                <td>
                  <VBtn
                    icon
                    size="small"
                    variant="text"
                    color="error"
                    @click="
                      confirmDelete(key.api_key_id ?? index, key.app_name)
                    "
                  >
                    <VIcon icon="ri-delete-bin-line" />
                  </VBtn>
                </td>
              </tr>
              <tr v-if="apiKeys.length === 0 && !isLoading">
                <td colspan="4" class="text-center text-grey">
                  No API keys found
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCard>
      </VCol>

      <VDialog v-model="showCreateDialog" max-width="500">
        <VCard>
          <VCardTitle>Create API Key</VCardTitle>
          <VCardText>
            <VTextField
              v-model="newKeyName"
              label="App Name"
              placeholder="e.g., Production App"
            />
          </VCardText>
          <VCardActions>
            <VSpacer />
            <VBtn variant="text" @click="showCreateDialog = false">
              Cancel
            </VBtn>
            <VBtn color="primary" @click="createKey" :disabled="!newKeyName">
              Create
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>

      <VDialog v-model="showKeyDialog" max-width="500" persistent>
        <VCard>
          <VCardTitle class="d-flex align-center">
            <VIcon icon="ri-key-line" class="mr-2" color="primary" />
            API Key Generated
          </VCardTitle>
          <VCardText>
            <VAlert type="warning" variant="tonal" class="mb-4">
              <strong>Important:</strong> This API key will only be shown once
              for security reasons. Please copy and store it in a secure place.
              You will not be able to retrieve it again.
            </VAlert>

            <VTextField
              :model-value="rawApiKey"
              label="Your API Key"
              readonly
              variant="outlined"
              append-inner-icon="ri-clipboard-line"
              @click:append-inner="copyApiKey"
              @click="copyApiKey"
            />

            <VCheckbox
              v-model="confirmedStored"
              label="I have securely stored this API key and understand it will not be shown again"
              class="mt-4"
            />
          </VCardText>
          <VCardActions>
            <VSpacer />
            <VBtn
              color="primary"
              :disabled="!confirmedStored"
              @click="closeKeyDialog"
            >
              I have saved my API key
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>

      <VDialog v-model="showDeleteDialog" max-width="500" persistent>
        <VCard>
          <VCardTitle class="d-flex align-center">
            <VIcon icon="ri-alert-line" class="mr-2" color="error" />
            Delete API Key
          </VCardTitle>
          <VCardText>
            <VAlert type="error" variant="tonal" class="mb-4">
              <strong>Warning:</strong> You are about to delete the API key for
              <strong>{{ keyToDelete?.app_name || "this application" }}</strong
              >.
            </VAlert>
            <p class="mb-2">
              Any mobile applications using this API key will stop working
              immediately. All associated deployments will fail until a new API
              key is generated.
            </p>
            <p class="text-body-2 text-grey">This action cannot be undone.</p>
          </VCardText>
          <VCardActions>
            <VSpacer />
            <VBtn
              variant="text"
              @click="
                showDeleteDialog = false;
                keyToDelete = null;
              "
            >
              Cancel
            </VBtn>
            <VBtn color="error" @click="deleteKey"> Delete API Key </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </VRow>

    <VSnackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
    </VSnackbar>
  </div>
</template>
