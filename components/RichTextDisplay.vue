<template>
  <div class="rich-text-display" v-html="sanitizedContent" />
</template>

<script setup lang="ts">
const props = defineProps<{
  content: string
}>()

// Basic HTML sanitization to prevent XSS
const sanitizedContent = computed(() => {
  if (!props.content) return ''

  // Only run sanitization on client-side
  if (process.server) {
    // On server, do basic text-based sanitization
    return props.content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  }

  // Client-side sanitization with DOM manipulation
  const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'span', 'div']
  const allowedAttributes = ['href', 'target', 'rel', 'class']

  // Create a temporary div to parse HTML
  const temp = document.createElement('div')
  temp.innerHTML = props.content

  // Remove all script tags
  const scripts = temp.querySelectorAll('script')
  scripts.forEach(script => script.remove())

  // Remove event handlers
  const allElements = temp.querySelectorAll('*')
  allElements.forEach((element) => {
    // Remove elements that are not in allowed list
    if (!allowedTags.includes(element.tagName.toLowerCase())) {
      element.remove()
      return
    }

    // Remove all event handler attributes
    Array.from(element.attributes).forEach((attr) => {
      if (attr.name.startsWith('on') || !allowedAttributes.includes(attr.name)) {
        element.removeAttribute(attr.name)
      }
    })

    // Ensure external links open in new tab and have security
    if (element.tagName.toLowerCase() === 'a') {
      element.setAttribute('target', '_blank')
      element.setAttribute('rel', 'noopener noreferrer')
    }
  })

  return temp.innerHTML
})
</script>

<style scoped lang="scss">
.rich-text-display {
  line-height: 1.6;
  color: #1d1d1f;

  :deep(> * + *) {
    margin-top: 0.75em;
  }

  :deep(h1) {
    font-size: 2em;
    font-weight: 700;
    line-height: 1.2;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  :deep(h2) {
    font-size: 1.5em;
    font-weight: 700;
    line-height: 1.3;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  :deep(h3) {
    font-size: 1.25em;
    font-weight: 600;
    line-height: 1.4;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  :deep(h4) {
    font-size: 1.1em;
    font-weight: 600;
    line-height: 1.4;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  :deep(p) {
    margin-bottom: 1em;
  }

  :deep(strong),
  :deep(b) {
    font-weight: 700;
  }

  :deep(em),
  :deep(i) {
    font-style: italic;
  }

  :deep(u) {
    text-decoration: underline;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 2rem;
    margin-bottom: 1em;
  }

  :deep(ul) {
    list-style-type: disc;
  }

  :deep(ol) {
    list-style-type: decimal;
  }

  :deep(li) {
    margin-bottom: 0.5em;
  }

  :deep(a) {
    color: #0066cc;
    text-decoration: underline;

    &:hover {
      color: #0052a3;
    }
  }
}
</style>
