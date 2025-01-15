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
    label: z.string().min(1, { message: 'Nome do campo não pode ser vazio' }),
    type: z.enum(['Texto', 'Número', 'Opções']),
    options: z.array(z.string().min(1, 'Campo obrigatório')).min(1, 'Adicione pelo menos 1 opção').optional(),
  })),
}).refine((data) => {
  return !(data.stockOption === StockOptions.LIMITED && !data.stockQuantity)
}, {
  message: 'Campo obrigatório',
  path: ['stockQuantity'],
})
