<template>
  <el-dialog v-model="visible" title="Ajouter une plage de résultat" width="500px">
    <el-form :model="form" label-position="top">
      <el-form-item label="Min Points">
        <el-input-number v-model="form.minPoints" :min="0" />
      </el-form-item>
      <el-form-item label="Max Points">
        <el-input-number v-model="form.maxPoints" :min="0" />
      </el-form-item>
      <el-form-item label="Message">
        <el-input v-model="form.message" type="textarea" />
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
const form = ref({ minPoints: 0, maxPoints: 0, message: '' })
const apiError = ref('')

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    form.value = { minPoints: 0, maxPoints: 0, message: '' }
    apiError.value = ''
  }
})
watch(visible, (val) => emit('update:modelValue', val))

const submit = async () => {
  apiError.value = ''

  if (!form.value.message.trim()) {
    apiError.value = 'Le message est requis.'
    return
  }

  if (form.value.maxPoints < form.value.minPoints) {
    apiError.value = 'Le maximum de points doit être supérieur ou égal au minimum.'
    return
  }

  try {
    await diagnosticService.createRange(form.value)
    ElMessage.success('Plage créée.')
    emit('refresh')
    visible.value = false
  } catch (e) {
    apiError.value = e?.response?.data?.message || e.message || 'Erreur lors de la création.'
  }
}
</script>
