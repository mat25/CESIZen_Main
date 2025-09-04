<template>
  <div class="resource-container">
    <h1 class="main-title">Liste des ressources</h1>
    <div class="resource-grid">
      <el-card
        v-for="resource in resources"
        :key="resource.id"
        class="resource-card"
        shadow="always"
      >
        <img v-if="resource.imageUrl" :src="resource.imageUrl" class="resource-image" />
        <h2 class="form-title">{{ resource.title }}</h2>
        <p class="resource-content paragraph">
          {{ truncate(resource.content, 200) }}
        </p>
        <el-button type="success" @click="readMore(resource.id)">
          <template #icon>
            <el-icon><Document /></el-icon>
          </template>
          Lire plus
        </el-button>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import resourceService from '@/services/resourceService'
import { Document } from '@element-plus/icons-vue'

const resources = ref([])

onMounted(async () => {
  try {
    const response = await resourceService.getResources()
    resources.value = response.data
  } catch (err) {
    console.error('Erreur lors du chargement des ressources :', err)
  }
})

function truncate(text, length) {
  return text.length > length ? text.substring(0, length) + '...' : text
}

function readMore(id) {
  window.location.href = `/ressources/${id}`
}
</script>

<style scoped>
.resource-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.resource-card {
  padding: 20px;
  border-radius: 10px;
  background-color: white;
}

.resource-content {
  color: #555;
  margin-bottom: 15px;
}

.resource-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
}


.resource-card .el-button {
  display: block;
  margin: 0 auto;
}

</style>