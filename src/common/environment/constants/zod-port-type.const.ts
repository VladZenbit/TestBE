import z from 'zod';

export const ZOD_PORT_TYPE = z.coerce.number().positive().max(65535);
