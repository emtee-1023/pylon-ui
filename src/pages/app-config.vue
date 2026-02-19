<script setup lang="ts">
import { ref } from 'vue'

const config = ref({
  appName: 'My Mobile App',
  version: '1.0.0',
  apiEndpoint: 'https://api.example.com',
  enableNotifications: true,
  enableAnalytics: true,
  theme: 'system',
  language: 'en',
})

const saveConfig = () => {
  console.log('Saving config:', config.value)
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h1 class="mb-5">App Configuration</h1>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardText>
          <VForm @submit.prevent="saveConfig">
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="config.appName"
                  label="App Name"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="config.version"
                  label="Version"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="config.apiEndpoint"
                  label="API Endpoint"
                />
              </VCol>

              <VCol cols="12">
                <VSelect
                  v-model="config.theme"
                  label="Theme"
                  :items="['system', 'light', 'dark']"
                />
              </VCol>

              <VCol cols="12">
                <VSelect
                  v-model="config.language"
                  label="Language"
                  :items="[
                    { title: 'English', value: 'en' },
                    { title: 'Spanish', value: 'es' },
                    { title: 'French', value: 'fr' },
                  ]"
                />
              </VCol>

              <VCol cols="12">
                <VSwitch
                  v-model="config.enableNotifications"
                  label="Enable Push Notifications"
                />
              </VCol>

              <VCol cols="12">
                <VSwitch
                  v-model="config.enableAnalytics"
                  label="Enable Analytics"
                />
              </VCol>

              <VCol cols="12">
                <VBtn
                  type="submit"
                  color="primary"
                >
                  Save Configuration
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
