import { entityQuery } from "#queries";

import { translate } from "#translations";
import {
  generateBinaryUUID,
  HTTP_STATUS,
  RESPONSE,
  executeAction,
} from "#utils";
import { ACTION } from "#config";

const { insertEntity, getEntityById, getEntitiesByType } = entityQuery;

export const updateEntity = async (req, payload) =>
  executeAction({
    req,
    action: { name: ACTION.NAME.ENTITY_UPDATE, type: ACTION.TYPE.ENTITY },
    resource: {},
    handler: async () => {
      const { name, meta, status, id } = payload;

      await entityQuery.updateEntity({
        id,
        name,
        metadata: meta,
        status,
      });

      return RESPONSE.struct(
        RESPONSE.status.SUCCESS,
        HTTP_STATUS.x2_OK,
        translate("entity.entity_updated"),
        "00023",
        {}, // Data
      );
    },
  });
