import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export class SupplyLots extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        VtexIdclientAutCookie: context.authToken,
      },
    })
  }

  public async getCollection(id: string) {
    const payloadRequest = await this.http.get<{ Description: string }>(
      `/api/logistics/pvt/inventory/items/${id}/warehouses/1_1/supplyLots`
    )

    return payloadRequest
  }
}
