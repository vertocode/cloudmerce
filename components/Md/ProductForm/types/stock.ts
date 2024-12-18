export enum StockOptions {
  LIMITED = 'LIMITED',
  UNLIMITED = 'UNLIMITED',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export const StockOptionLabels = {
  [StockOptions.LIMITED]: 'Limitado',
  [StockOptions.UNLIMITED]: 'Ilimitado',
  [StockOptions.OUT_OF_STOCK]: 'Sem Estoque (Não disponível)',
} as const
