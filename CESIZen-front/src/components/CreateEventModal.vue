<template>
  <el-dialog v-model="visible" title="Ajouter un événement" width="500px">
    <el-form :model="form" label-position="top">
      <el-form-item label="Titre">
        <el-input v-model="form.label" />
      </el-form-item>
      <el-form-item label="Points">
        <el-input-number v-model="form.points" :min="0" />
      </el-form-item>

      <el-alert
        v-if="apiError"
        :description="apiError"
        type="error"
        show-icon
        closable
        @close="apiError = ''"
        class="mb-3"
      />
    </el-form>

    <template #footer>
      <el-button @click="visible = false">Annuler</el-button>
      <el-button type="success" @click="submit">Créer</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import diagnosticService from '@/services/diagnosticService'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue', 'refresh'])

const visible = ref(false)
const form = ref({ label: '', points: 0 })
const apiError = ref('')

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    form.value = { label: '', points: 0 }
    apiError.value = ''
  }
})
watch(visible, (val) => emit('update:modelValue', val))

const submit = async () => {
  apiError.value = ''

  if (!form.value.label.trim()) {
    apiError.value = 'Le titre est requis.'
    return
  }
  if (form.value.points <= 0) {
    apiError.value = 'Les points doivent être supérieurs à 0.'
    return
  }

  try {
    await diagnosticService.createEvent(form.value)
    ElMessage.success('Événement créé.')
    emit('refresh')
    visible.value = false
  } catch (e) {
    apiError.value = e?.response?.data?.message || e.message || 'Erreur lors de la création.'
  }
}
</script>
