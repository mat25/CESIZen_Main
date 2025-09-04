<template>
  <el-dialog v-model="visible" :title="isEdit ? 'Modifier une ressource' : 'Créer une ressource'" width="600px">
    <el-form :model="form" label-position="top">
      <el-form-item label="Titre">
        <el-input v-model="form.title" placeholder="Titre de la ressource" />
      </el-form-item>
      <el-form-item label="Contenu">
        <el-input type="textarea" v-model="form.content" placeholder="Contenu de la ressource" :rows="6" />
      </el-form-item>
      <el-form-item label="Image (URL)">
        <el-input v-model="form.imageUrl" placeholder="Lien de l'image" />
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
      <el-button type="primary" :loading="loading" @click="submitForm">
        {{ isEdit ? 'Mettre à jour' : 'Créer' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import resourceService from '@/services/resourceService'

const props = defineProps({
  modelValue: Boolean,
  resource: Object
})
const emit = defineEmits(['update:modelValue', 'refresh'])

const visible = ref(false)
const loading = ref(false)
const apiError = ref('')
const form = ref({
  title: '',
  content: '',
  imageUrl: ''
})

const isEdit = ref(false)

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val && props.resource) {
    form.value = { ...props.resource }
    isEdit.value = true
    apiError.value = ''
  } else {
    form.value = { title: '', content: '', imageUrl: '' }
    isEdit.value = false
    apiError.value = ''
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const submitForm = async () => {
  apiError.value = ''

  if (!form.value.title.trim()) {
    apiError.value = 'Le titre est requis.'
    return
  }
  if (!form.value.content.trim()) {
    apiError.value = 'Le contenu est requis.'
    return
  }

  loading.value = true
  try {
    if (isEdit.value) {
      await resourceService.updateResource(props.resource.id, form.value)
      ElMessage.success('Ressource mise à jour.')
    } else {
      await resourceService.createResource(form.value)
      ElMessage.success('Ressource créée.')
    }
    emit('refresh')
    visible.value = false
  } catch (error) {
    apiError.value = error?.response?.data?.message || error.message || "Erreur lors de l'enregistrement."
  } finally {
    loading.value = false
  }
}
</script>
