
<template>
  <div class="diagnostics-container">
    <h1 class="main-title">Diagnostic de stress</h1>
    <p class="paragraph diagnostics-description">
      Cliquez sur le bouton ci-dessous pour réaliser un nouveau diagnostic de stress.
    </p>

    <el-button type="success" class="diagnostic-button" @click="$router.push({name: 'Diagnostic'})">
      Réaliser un diagnostic de stress
    </el-button>

    <div v-if="history.length" class="diagnostic-history-section">
      <h2 class="form-title">Historique de vos diagnostics</h2>
      <div class="diagnostic-history">
        <el-card
          v-for="(entry, index) in history"
          :key="index"
          class="history-card"
          shadow="always">
          <p><strong>Date :</strong> {{ entry.date }}</p>
          <p><strong>Score :</strong> {{ entry.score }}</p>
          <p><strong>Niveau :</strong> {{ entry.level }}</p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import diagnosticService from '@/services/diagnosticService'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
const history = ref([])

onMounted(async () => {
  if (!user.value) return
  try {
    const response = await diagnosticService.getHistory()
    history.value = response.data.map(entry => {
      const date = new Date(entry.submittedAt)
      return {
        date: `${date.toLocaleDateString('fr-FR')} à ${date.getHours()}h${String(date.getMinutes()).padStart(2, '0')}`,
        score: entry.score,
        level: entry.level
      }
    })
  } catch (error) {
    console.error('Erreur lors du chargement de l\'historique :', error)
  }
})
</script>

<style scoped>
.diagnostics-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  background-color: white;
  color: black;
}

.diagnostics-description {
  margin-top: 0;
}

.diagnostic-button {
  display: block;
  margin: 0 auto;
}

.history-card {
  margin-bottom: 20px;
  padding: 15px;
  flex: 1 1 250px;
  max-width: 300px;
}

.diagnostic-history {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

</style>
