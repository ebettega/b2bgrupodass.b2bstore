export async function supplyLots(ctx: Context, next: () => Promise<any>) {
  const skuId = Array.isArray(ctx.query.id) ? ctx.query.id[0] : ctx.query.id

  ctx.response.status = 200
  const response = await ctx.clients.supplyLots.getCollection(skuId)

  ctx.response.body = { response }
  await next()
}
