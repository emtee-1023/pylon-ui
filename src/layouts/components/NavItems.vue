<script lang="ts" setup>
import VerticalNavSectionTitle from "@/@layouts/components/VerticalNavSectionTitle.vue";
import VerticalNavLink from "@layouts/components/VerticalNavLink.vue";
</script>

<template>
  <VerticalNavSectionTitle
    :item="{
      heading: 'Overview',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Dashboard',
      icon: 'ri-dashboard-line',
      to: '/dashboard',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Deployments',
      icon: 'ri-rocket-line',
      to: '/deployments',
    }"
  />

  <VerticalNavSectionTitle
    :item="{
      heading: 'Mobile App',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'API Keys',
      icon: 'ri-key-line',
      to: '/api-keys',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Companies',
      icon: 'ri-building-line',
      to: '/companies',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'App Configurations',
      icon: 'ri-settings-3-line',
      to: '/app-config',
    }"
  />
</template>
