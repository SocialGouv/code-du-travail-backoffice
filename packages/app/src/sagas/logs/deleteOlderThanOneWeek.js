import { put } from "redux-saga/effects";

import { logs } from "../../actions";
import customNumeral from "../../libs/customNumeral";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";

const API_CHECK_PATH = "/logs";
const API_DELETE_PATH = "/rpc/purge_logs";

export default function* deleteOlderThanOneWeek() {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const checkRequest = customPostgrester().lte("created_at", oneWeekAgo);
    const { data } = yield checkRequest.get(API_CHECK_PATH);
    if (data.length === 0) {
      toast.warn(`Aucun log datant d'il y a plus d'une semaine n'a été trouvé.`);

      return;
    }

    const deleteRequest = customPostgrester().lte("created_at", oneWeekAgo);

    yield deleteRequest.post(API_DELETE_PATH);
    toast.success(`${customNumeral(data.length).format("0,0")} logs ont été purgés.`);
    yield put(logs.load({ pageIndex: -1 }));
  } catch (err) {
    toast.error(err.message);
    yield put(logs.deleteOlderThanOneWeekFailure({ message: null }));
  }
}
