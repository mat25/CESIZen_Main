<template>
  <div class="admin-resources-container">
    <h1 class="main-title">Gestion des ressources</h1>

    <div class="section-label">Créer une ressource</div>
    <div class="create-button">
      <el-button type="success" @click="openCreateModal">Créer une ressource</el-button>
    </div>

    <div class="section-label">Liste des ressources</div>
    <el-table :data="paginatedResources" style="width: 100%" class="resource-table">
      <el-table-column prop="title" label="Titre" sortable />
      <el-table-column label="Gestion" align="center">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button type="primary" size="small" @click="editResource(row)">Modifier</el-button>
            <el-button type="danger" size="small" @click="deleteResource(row.id)">Supprimer</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="resources.length > pageSize"
      background
      layout="prev, pager, next"
      :total="resources.length"
      :page-size="pageSize"
      @current-change="currentPage = $event"
      class="table-pagination"
    />

    <!-- Modal de création/modification -->
    <ResourceFormModal
      v-model="showModal"
      :resource="selectedResource"
      @refresh="fetchResources"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import resourceService from '@/services/resourceService'
import { ElMessage, ElMessageBox } from 'element-plus'
import ResourceFormModal from '@/components/ResourceFormModal.vue'

const resources = ref([])
const showModal = ref(false)
const selectedResource = ref(null)

const pageSize = 15
const currentPage = ref(1)

const paginatedResources = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return resources.value.slice(start, start + pageSize)
})

const fetchResources = async () => {
  try {
    const response = await resourceService.getResources()
    resources.value = response.data
  } catch (error) {
    ElMessage.error("Erreur lors du chargement des ressources.")
  }
}

const deleteResource = async (id) => {
  try {
    await ElMessageBox.confirm(
      'Êtes-vous sûr de vouloir supprimer cette ressource ?',
      'Confirmation',
      {
        type: 'warning',
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
      }
    )
    await resourceService.deleteResource(id)
    ElMessage.success('Ressource supprimée.')
    fetchResources()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error("Erreur lors de la suppression.")
    }
  }
}

const editResource = (resource) => {
  selectedResource.value = resource
  showModal.value = true
}

const openCreateModal = () => {
  selectedResource.value = null
  showModal.value = true
}

onMounted(fetchResources)
</script>

<style scoped>
.admin-resources-container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
}
.create-button {
  margin-bottom: 20px;
}
.resource-table {
  margin-top: 20px;
}
.table-pagination {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.section-label {
  text-align: left;
}
</style>
