<template>
  <div class="rich-text-editor">
    <div v-if="editor" class="toolbar">
      <VBtn
        size="small"
        variant="text"
        :class="{ 'is-active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
      >
        <VIcon>mdi-format-bold</VIcon>
      </VBtn>
      <VBtn
        size="small"
        variant="text"
        :class="{ 'is-active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
      >
        <VIcon>mdi-format-italic</VIcon>
      </VBtn>
      <VBtn
        size="small"
        variant="text"
        :class="{ 'is-active': editor.isActive('underline') }"
        @click="editor.chain().focus().toggleUnderline().run()"
      >
        <VIcon>mdi-format-underline</VIcon>
      </VBtn>
      <VDivider vertical class="mx-2" />
      <VBtn
        size="small"
        variant="text"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        <VIcon>mdi-format-header-1</VIcon>
      </VBtn>
      <VBtn
        size="small"
        variant="text"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        <VIcon>mdi-format-header-2</VIcon>
      </VBtn>
      <VBtn
        size="small"
        variant="text"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        <VIcon>mdi-format-header-3</VIcon>
      </VBtn>
      <VDivider vertical class="mx-2" />
      <VBtn
        size="small"
        variant="text"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <VIcon>mdi-format-list-bulleted</VIcon>
      </VBtn>
      <VBtn
        size="small"
        variant="text"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <VIcon>mdi-format-list-numbered</VIcon>
      </VBtn>
      <VDivider vertical class="mx-2" />
      <VBtn
        size="small"
        variant="text"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
      >
        <VIcon>mdi-undo</VIcon>
      </VBtn>
      <VBtn
        size="small"
        variant="text"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
      >
        <VIcon>mdi-redo</VIcon>
      </VBtn>
    </div>
    <EditorContent :editor="editor" class="editor-content" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

// Only initialize editor on client-side
const editor = process.client ? useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
}) : ref(null)

watch(() => props.modelValue, (value) => {
  if (editor.value && value !== editor.value.getHTML()) {
    editor.value.commands.setContent(value, false)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped lang="scss">
.rich-text-editor {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  overflow: hidden;

  .toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px;
    background-color: #f5f5f7;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    flex-wrap: wrap;

    .is-active {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }

  .editor-content {
    padding: 16px;
    min-height: 200px;
    max-height: 500px;
    overflow-y: auto;

    :deep(.ProseMirror) {
      outline: none;

      > * + * {
        margin-top: 0.75em;
      }

      ul,
      ol {
        padding: 0 1rem;
      }

      h1 {
        font-size: 2em;
        font-weight: 700;
        line-height: 1.2;
      }

      h2 {
        font-size: 1.5em;
        font-weight: 700;
        line-height: 1.3;
      }

      h3 {
        font-size: 1.25em;
        font-weight: 600;
        line-height: 1.4;
      }

      p {
        line-height: 1.6;
      }

      strong {
        font-weight: 700;
      }

      em {
        font-style: italic;
      }

      u {
        text-decoration: underline;
      }

      &.ProseMirror-focused {
        outline: none;
      }

      p.is-editor-empty:first-child::before {
        color: #adb5bd;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
      }
    }
  }
}
</style>
