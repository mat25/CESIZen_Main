<template>
  <div class="admin-diagnostics-container">
    <h1 class="main-title">Gestion des diagnostics</h1>

    <!-- Événements -->
    <div class="section-label">Événements de stress</div>
    <el-table :data="paginatedEvents" style="width: 100%" class="diagnostic-table">
      <el-table-column prop="label" label="Événement" />
      <el-table-column prop="points" label="Points" width="100" />
      <el-table-column label="Gestion" align="center" width="200">
        <template #default="{ row }">
          <el-button size="small" type="warning" @click="openEventModal(row)">Modifier</el-button>
          <el-button size="small" type="danger" @click="deleteEvent(row.id)">Supprimer</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="events.length > pageSize"
      background
      layout="prev, pager, next"
      :total="events.length"
      :page-size="pageSize"
      @current-change="currentEventPage = $event"
      class="table-pagination"
    />
    <div class="table-actions">
      <el-button type="success" @click="showCreateEvent = true">Ajouter un événement</el-button>
    </div>

    <!-- Résultats -->
    <div class="section-label">Plages de résultats</div>
    <el-table :data="paginatedRanges" style="width: 100%" class="diagnostic-table">
      <el-table-column prop="minPoints" label="Min" width="100" />
      <el-table-column prop="maxPoints" label="Max" width="100" />
      <el-table-column prop="message" label="Message" />
      <el-table-column label="Gestion" align="center" width="200">
        <template #default="{ row }">
          <el-button size="small" type="warning" @click="openRangeModal(row)">Modifier</el-button>
          <el-button size="small" type="danger" @click="deleteRange(row.id)">Supprimer</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="ranges.length > pageSize"
      background
      layout="prev, pager, next"
      :total="ranges.length"
      :page-size="pageSize"
      @current-change="currentRangePage = $event"
      class="table-pagination"
    />
    <div class="table-actions">
      <el-button type="success" @click="showCreateRange = true">Ajouter un résultat</el-button>
    </div>

    <!-- Modales -->
    <EventEditModal v-model="showEventModal" :event="eventForm" @refresh="fetchData" />
    <RangeEditModal v-model="showRangeModal" :range="rangeForm" @refresh="fetchData" />
    <CreateEventModal v-model="showCreateEvent" @refresh="fetchData" />
    <CreateRangeModal v-model="showCreateRange" @refresh="fetchData" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import diagnosticService from '@/services/diagnosticService'
import { ElMessage, ElMessageBox } from 'element-plus'
import EventEditModal from '@/components/EventEditModal.vue'
import RangeEditModal from '@/components/RangeEditModal.vue'
import CreateEventModal from '@/components/CreateEventModal.vue'
import CreateRangeModal from '@/components/CreateRangeModal.vue'

const events = ref([])
const ranges = ref([])

const pageSize = 10
const currentEventPage = ref(1)
const currentRangePage = ref(1)

const paginatedEvents = computed(() => {
  const start = (currentEventPage.value - 1) * pageSize
  return events.value.slice(start, start + pageSize)
})

const paginatedRanges = computed(() => {
  const start = (currentRangePage.value - 1) * pageSize
  return ranges.value.slice(start, start + pageSize)
})

const showEventModal = ref(false)
const showRangeModal = ref(false)
const showCreateEvent = ref(false)
const showCreateRange = ref(false)

const eventForm = ref(null)
const rangeForm = ref(null)

const fetchData = async () => {
  try {
    const [eventRes, rangeRes] = await Promise.all([
      diagnosticService.getEvents(),
      diagnosticService.getRanges()
    ])
    events.value = eventRes.data
    ranges.value = rangeRes.data
  } catch (error) {
    ElMessage.error("Erreur lors du chargement des données.")
  }
}

const deleteEvent = async (id) => {
  try {
    await ElMessageBox.confirm('Supprimer cet événement ?', 'Confirmation', {
      type: 'warning',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    })
    await diagnosticService.deleteEvent(id)
    ElMessage.success('Événement supprimé.')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') ElMessage.error("Erreur lors de la suppression.")
  }
}

const deleteRange = async (id) => {
  try {
    await ElMessageBox.confirm('Supprimer cette plage ?', 'Confirmation', {
      type: 'warning',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    })
    await diagnosticService.deleteRange(id)
    ElMessage.success('Plage supprimée.')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') ElMessage.error("Erreur lors de la suppression.")
  }
}

const openEventModal = (event) => {
  eventForm.value = { ...event }
  showEventModal.value = true
}

const openRangeModal = (range) => {
  rangeForm.value = { ...range }
  showRangeModal.value = true
}

onMounted(fetchData)
</script>

<style scoped>
.admin-diagnostics-container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
}
.table-actions {
  text-align: center;
  margin: 20px 0;
}
.table-pagination {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

</style>
