<template>
  <el-dialog v-model="visible" title="Modifier un événement" width="500px">
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
      <el-button type="primary" @click="submit">Enregistrer</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import diagnosticService from '@/services/diagnosticService'

const props = defineProps({
  modelValue: Boolean,
  event: Object
})
const emit = defineEmits(['update:modelValue', 'refresh'])

const visible = ref(false)
const form = ref({ label: '', points: 0 })
const apiError = ref('')

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val && props.event) {
    form.value = { ...props.event }
    apiError.value = ''
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

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
    await diagnosticService.updateEvent(props.event.id, form.value)
    ElMessage.success('Événement mis à jour.')
    emit('refresh')
    visible.value = false
  } catch (error) {
    apiError.value = error?.response?.data?.message || error.message || 'Erreur lors de la mise à jour.'
  }
}
</script>
