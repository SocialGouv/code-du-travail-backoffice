/* eslint-disable sort-keys-fix/sort-keys-fix */

import { put } from "redux-saga/effects";
import unistUtilFind from "unist-util-find";
import unistUtilParents from "unist-util-parents";

import { alerts } from "../../actions";
import cache from "../../libs/cache";
import cdtnApi from "../../libs/cdtnApi";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";

export default function* load() {
  try {
    const request = customPostgrester()
      .is("is_done", false)
      .orderBy("version", true)
      .orderBy("dila_container_id");

    const { data } = yield request.get("/alerts", true);

    let lastVersion = null;
    let lastDilaContainerId = null;
    let lastDilaCid = null;
    let index = -1;
    let key = 0;
    const branches = [];
    const indexMax = data.length;
    while (++index < indexMax) {
      const { answer_id, dila_cid, dila_container_id, dila_id, version, value } = data[index];

      if (version !== lastVersion) {
        branches.push({
          type: "version",
          data: {
            key: `v${String(++key)}`,
            label: `v${version}`,
          },
          children: [],
        });

        lastVersion = version;
      }

      const lastVersionInTheTree = branches[branches.length - 1];

      if (dila_container_id !== lastDilaContainerId) {
        let agreement;
        try {
          const path = `/agreement/${dila_container_id}`;
          agreement = yield cache.get(path);
          if (agreement === undefined) {
            agreement = (yield cdtnApi.get(path)).data;
            yield cache.set(path, agreement);
          }
        } catch (err) {
          continue;
        }

        lastVersionInTheTree.children.push({
          type: "agreement",
          data: {
            id: dila_container_id,
            key: String(++key),
            label: `[${String(agreement.num).padStart(4, "0")}] ${agreement.shortTitle}`,
          },
          children: [],
        });

        lastDilaContainerId = dila_container_id;
      }

      const lastAgreementInTheTree =
        lastVersionInTheTree.children[lastVersionInTheTree.children.length - 1];

      if (dila_cid !== lastDilaCid) {
        let article;
        try {
          const path = `/agreement/article/${dila_cid}`;
          article = yield cache.get(path);
          if (article === undefined) {
            article = yield cdtnApi.get(path);
            yield cache.set(path, article);
          }
        } catch (err) {
          lastAgreementInTheTree.children.push({
            type: "article",
            data: {
              cid: dila_cid,
              id: dila_id,
              key: String(++key),
              label: `!!! CID ${dila_cid}`,
            },
            children: [],
          });

          continue;
        }

        lastAgreementInTheTree.children.push({
          type: "article",
          data: {
            cid: dila_cid,
            id: dila_id,
            key: String(++key),
            label: `Article ${article.index}`,
          },
          children: [],
        });

        lastDilaCid = dila_cid;
      }

      const lastArticleInTheTree =
        lastAgreementInTheTree.children[lastAgreementInTheTree.children.length - 1];

      let answer;
      const path = `/answer-${answer_id}`;
      answer = yield cache.get(path);
      if (answer === undefined) {
        const answerRequest = customPostgrester()
          .select("id")
          .select("question(index,value)")
          .eq("id", answer_id);
        answer = (yield answerRequest.get("/answers")).data[0];
        yield cache.set(path, answer);
      }

      lastArticleInTheTree.children.push({
        type: "answer",
        data: {
          id: answer_id,
          key: String(++key),
          label: `${answer.question.index}) ${answer.question.value}`,
          value,
        },
      });
    }

    const tree = unistUtilParents({
      type: "root",
      children: branches,
    });

    const firstAnswerInTree = unistUtilFind(tree, { type: "answer" });
    const selectedKey = firstAnswerInTree !== undefined ? firstAnswerInTree.data.key : null;

    yield put(alerts.loadSuccess({ tree }));
    yield put(alerts.selectOne(selectedKey));
  } catch (err) /* istanbul ignore next */ {
    toast.error(err.message);
    yield put(alerts.loadFailure({ message: null }));
  }
}
