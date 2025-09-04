<template>
  <el-dialog v-model="visible" title="Modifier une plage" width="500px">
    <el-form :model="form" label-position="top">
      <el-form-item label="Min Points">
        <el-input-number v-model="form.minPoints" :min="0" />
      </el-form-item>
      <el-form-item label="Max Points">
        <el-input-number v-model="form.maxPoints" :min="0" />
      </el-form-item>
      <el-form-item label="Message">
        <el-input v-model="form.message" type="textarea" :rows="3" />
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
  range: Object
})
const emit = defineEmits(['update:modelValue', 'refresh'])

const visible = ref(false)
const form = ref({ minPoints: 0, maxPoints: 0, message: '' })
const apiError = ref('')

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val && props.range) {
    form.value = { ...props.range }
    apiError.value = ''
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

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
    await diagnosticService.updateRange(props.range.id, form.value)
    ElMessage.success('Plage mise à jour.')
    emit('refresh')
    visible.value = false
  } catch (error) {
    apiError.value = error?.response?.data?.message || error.message || 'Erreur lors de la mise à jour.'
  }
}
</script>
