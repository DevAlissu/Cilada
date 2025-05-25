import { z } from 'zod';

export const crudMarcaSchema = z.object({
  codmarca: z.string().nonempty('Código da marca é obrigatório'),
  descr: z.string().nonempty('Descrição da marca é obrigatória'),
});
