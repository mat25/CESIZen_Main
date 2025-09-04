
<template>
  <div class="resource-detail-container">
    <el-button class="back-button" type="text" @click="$router.push({name: 'Ressources'})">
      <el-icon><ArrowLeft /></el-icon>
    </el-button>

    <h1 class="main-title">{{ resource.title }}</h1>

    <div class="resource-layout">
      <div class="resource-image-wrapper">
        <img :src="resource.imageUrl || defaultLogo" alt="Image de la ressource" class="resource-image" />
      </div>

      <el-card class="resource-content-card" shadow="always">
        <p class="resource-content paragraph">{{ resource.content }}</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import resourceService from '@/services/resourceService'
import logo from '@/assets/images/big-logo.png'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const resource = ref({})
const defaultLogo = logo

onMounted(async () => {
  try {
    const response = await resourceService.getResourceById(route.params.id)
    resource.value = response.data
  } catch (err) {
    console.error('Erreur lors du chargement de la ressource :', err)
  }
})
</script>

<style scoped>
.resource-detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
}

.resource-layout {
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: flex-start;
}

.resource-image-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}

.resource-image {
  width: 100%;
  max-width: 600px;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
}

.resource-content-card {
  flex: 2;
  padding: 20px;
}

.resource-content {
  text-align: left;
  line-height: 1.6;
  color: #333;
}

@media (max-width: 768px) {
  .resource-layout {
    flex-direction: column;
  }

  .resource-image-wrapper {
    margin-bottom: 20px;
  }
}
</style>
