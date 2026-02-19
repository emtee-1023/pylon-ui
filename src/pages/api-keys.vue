<script setup lang="ts">
import { ref } from 'vue'

const apiKeys = ref([
  { id: 1, name: 'Production App', key: 'pk_live_xxxxx...xxxxx', created: '2024-01-15', lastUsed: '2024-02-01' },
  { id: 2, name: 'Development App', key: 'pk_test_xxxxx...xxxxx', created: '2024-01-20', lastUsed: '2024-01-28' },
])

const showCreateDialog = ref(false)
const newKeyName = ref('')

const createKey = () => {
  console.log('Creating key:', newKeyName.value)
  showCreateDialog.value = false
  newKeyName.value = ''
}

const copyKey = (key: string) => {
  navigator.clipboard.writeText(key)
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h1 class="mb-5">API Keys</h1>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>API Keys</span>
          <VBtn
            color="primary"
            @click="showCreateDialog = true"
          >
            Create API Key
          </VBtn>
        </VCardTitle>

        <VTable>
          <thead>
            <tr>
              <th>Name</th>
              <th>API Key</th>
              <th>Created</th>
              <th>Last Used</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="key in apiKeys"
              :key="key.id"
            >
              <td>{{ key.name }}</td>
              <td>
                <code>{{ key.key }}</code>
                <VBtn
                  icon
                  size="small"
                  variant="text"
                  @click="copyKey(key.key)"
                >
                  <VIcon icon="ri-clipboard-line" />
                </VBtn>
              </td>
              <td>{{ key.created }}</td>
              <td>{{ key.lastUsed }}</td>
              <td>
                <VBtn
                  icon
                  size="small"
                  variant="text"
                  color="error"
                >
                  <VIcon icon="ri-delete-bin-line" />
                </VBtn>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>

    <VDialog
      v-model="showCreateDialog"
      max-width="500"
    >
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
          <VBtn
            variant="text"
            @click="showCreateDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="primary"
            @click="createKey"
          >
            Create
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>
</template>
