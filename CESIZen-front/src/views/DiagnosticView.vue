<template>
  <div class="diagnostic-container">
    <el-button class="back-button" type="text" @click="$router.push({name: 'Diagnostics'})">
      <el-icon><ArrowLeft /></el-icon>
    </el-button>
    <h1 class="main-title">Diagnostic de stress</h1>
    <p class="paragraph diagnostic-description">
      Le diagnostic de stress est basé sur l’échelle de Holmes et Rahe.
      <br />
      Pour déterminer votre niveau de stress, veuillez indiquer, pour chaque événement, le nombre de fois qu’il s’est produit au cours des 24 derniers mois.
    </p>

    <div v-for="event in events" :key="event.id" class="event-item">
      <label :for="'event-' + event.id" class="form-label">{{ event.label }}</label>
      <el-input-number
        v-model="event.occurrences"
        :min="0"
        :max="100"
        :id="'event-' + event.id"
        class="event-input"
      />
    </div>

    <el-button type="success" class="submit-button" @click="submitDiagnostic">
      Valider
    </el-button>

    <div v-if="result" class="diagnostic-result">
      <p><strong>Score :</strong> {{ result.score }}</p>
      <p><strong>Niveau :</strong> {{ result.level }}</p>
    </div>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import diagnosticService from '@/services/diagnosticService'
import { ArrowLeft } from '@element-plus/icons-vue'

const events = ref([])
const result = ref(null)

onMounted(async () => {
  try {
    const response = await diagnosticService.getEvents()
    events.value = response.data.map(event => ({
      ...event,
      occurrences: 0
    }))
  } catch (error) {
    ElMessage.error('Erreur lors du chargement des événements.')
  }
})

const submitDiagnostic = async () => {
  try {
    const payload = {
      selectedEvents: events.value.map(e => ({
        eventId: e.id,
        occurrences: e.occurrences
      }))
    }
    const response = await diagnosticService.submitDiagnostic(payload)
    result.value = response.data
    ElMessage.success('Diagnostic soumis avec succès.')
  } catch (error) {
    ElMessage.error('Une erreur est survenue lors de la soumission.')
  }
}
</script>





<style scoped>

.diagnostic-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 30px 20px;
  background-color: white;
  color: black;
}

.diagnostic-description {
  margin-bottom: 30px;
  margin-top: 0;
}

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 10px 15px;
  border-radius: 6px;
}

.event-input {
  margin-left: 20px;
}

.submit-button {
  display: block;
  margin: 30px auto 0;
  padding: 10px 30px;
}
.diagnostic-result {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background-color: #f0f9eb;
  color: #67c23a;
  font-weight: 500;
  text-align: center;
}

</style>
