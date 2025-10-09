import { z } from 'zod'
import { StockOptions } from '~/components/Md/ProductForm/types/stock'

export const validationSchema = z.object({
  productName: z.string().min(3, { message: 'Nome do produto deve ter pelo menos 3 caracteres' }),
  productPrice: z.number().min(1, { message: 'Preço do produto deve ser maior ou igual a R$1,00' }),
  productDescription: z.string().min(10, { message: 'Descrição deve ter pelo menos 10 caracteres' }),
  productType: z.string().nonempty({ message: 'O tipo de produto é obrigatório' }),
  stockOption: z.enum(Object.values(StockOptions)),
  stockQuantity: z.number().int().min(1, { message: 'Quantidade de estoque deve ser maior que 0' }).nullable().optional(),
  imageFiles: z.array(
    z.any(),
  ).min(1, { message: 'Adicione pelo menos 1 imagem' }),
  userFields: z.array(z.object({
    label: z.string().min(1, { message: 'Nome da variante não pode ser vazio' }),
    type: z.enum(['Texto', 'Número', 'Opções']),
    options: z.array(z.object({
      name: z.string().min(1, { message: 'Nome da opção é obrigatório' }),
      hex: z.string().optional(),
      image: z.any().optional().nullable(),
    })).min(1, { message: 'Adicione pelo menos 1 opção' }).optional(),
  })).superRefine((fields, ctx) => {
    // Validate that color variants have hex values
    fields.forEach((field, fieldIndex) => {
      const isColorVariant = field.label &&
        ['cor', 'color', 'cores', 'colors'].includes(field.label.toLowerCase())

      if (isColorVariant && field.options) {
        field.options.forEach((option, optionIndex) => {
          if (!option.hex || option.hex.trim() === '') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Código hex é obrigatório para variantes de cor',
              path: [fieldIndex, 'options', optionIndex, 'hex'],
            })
          }
        })
      }
    })
  }),
}).refine((data) => {
  return !(data.stockOption === StockOptions.LIMITED && !data.stockQuantity)
}, {
  message: 'Campo obrigatório',
  path: ['stockQuantity'],
})
