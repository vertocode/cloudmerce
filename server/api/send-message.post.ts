import emailjs from 'emailjs-com'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const serviceId = config.emailjsServiceId
  const templateId = config.emailjstemplateId
  const userId = config.emailjsuserId
  if (!serviceId || !templateId || !userId) {
    return new Response('EmailJS config not found', { status: 500 })
  }

  const body = await readBody(event)
  const { email, name, message } = body || {}
  const response = await emailjs.send(serviceId, templateId, {
    fromName: name,
    userEmail: email,
    message: message,
    date: new Date().toLocaleString(),
    toName: 'Tech Support',
  }, userId)

  return new Response(JSON.stringify(response), { status: 200 })
})
