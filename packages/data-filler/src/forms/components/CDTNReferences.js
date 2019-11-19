import React from "react";
import { FieldArray } from "formik";
import { Button, Table } from "reactstrap";
import { Trash, ExternalLink, PlusSquare, RotateCw, Menu } from "react-feather";
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";

import { searchResults } from "../../cdtn-api";

import CDTNPicker from "./CDTNPicker";
import Relevance from "./Relevance";
import getRowId from "./getRowId";

const MyTableFooter = ({ sortable, loadable, onAddClick, onRefreshClick }) => (
  <thead>
    <tr>
      <td colSpan={4}>
        <Button
          onClick={onAddClick}
          size="small"
          color="primary"
          style={{
            whiteSpace: "nowrap",
            marginTop: 20,
            marginRight: 20
          }}
          variant="contained"
        >
          <PlusSquare size={16} style={{ marginRight: 10 }} />
          Ajouter une référence
        </Button>

        {loadable && (
          <Button
            onClick={onRefreshClick}
            color="success"
            size="small"
            style={{ whiteSpace: "nowrap", marginTop: 20 }}
            variant="contained"
          >
            <RotateCw size={16} style={{ marginRight: 10 }} />
            Charger depuis CDTN
          </Button>
        )}
      </td>
      <td />
    </tr>
  </thead>
);

const DragHandle = SortableHandle(() => (
  <Menu size={16} style={{ cursor: "pointer" }} />
));

const ReferenceRow = SortableElement(
  ({ index, row, sortable, setRowValue, setRowRelevance, onRemoveClick }) => (
    <tr>
      {sortable && (
        <td width={50}>
          <DragHandle />
        </td>
      )}
      <td>
        <CDTNPicker
          query={getRowId(row) || ""}
          onSelect={value => setRowValue(value)}
        />
      </td>
      <td
        align="center"
        width={50}
        style={{
          padding: 0,
          verticalAlign: "middle"
        }}
      >
        <ExternalLink
          size={16}
          style={{ cursor: "pointer" }}
          onClick={() => {
            const CDTN_URL =
              "https://code-du-travail-numerique.incubateur.social.gouv.fr";
            const url = row.url[0] === "/" ? `${CDTN_URL}${row.url}` : row.url;
            window.open(url);
          }}
        />
      </td>
      {!sortable && (
        <td
          align="center"
          style={{
            width: 200,
            padding: 0,
            verticalAlign: "middle"
          }}
          align="center"
        >
          <Relevance
            value={row.relevance}
            onChange={value => setRowRelevance(value)}
          />
        </td>
      )}
      <td
        width={50}
        align="center"
        style={{
          padding: 0,
          verticalAlign: "middle"
        }}
      >
        <Trash
          size={16}
          onClick={onRemoveClick}
          style={{ cursor: "pointer", color: "#d63626" }}
        />
      </td>
    </tr>
  )
);

const sortByPosition = (a, b) => {
  if (a.position < b.position) {
    return -1;
  } else if (a.position > b.position) {
    return 1;
  }
  return 0;
};

// handle multiple references
const References = SortableContainer(
  ({
    setRowValue,
    setRowRelevance,
    sortable,
    loadable,
    values,
    onAddClick,
    onRemoveClick,
    onRefreshClick
  }) => (
    <FieldArray
      name="refs"
      render={({}) => (
        <Table padding="dense">
          <thead>
            <tr>
              {sortable && <td>-</td>}
              <td>Résultat</td>
              <td>-</td>
              {!sortable && <td style={{ textAlign: "center" }}>Pertinence</td>}
              <td>-</td>
            </tr>
          </thead>
          <tbody>
            {values &&
              values
                .sort(sortByPosition)
                .map(
                  (row, index) =>
                    row && (
                      <ReferenceRow
                        key={row.url + index}
                        sortable={sortable}
                        index={index}
                        row={row}
                        setRowValue={value => setRowValue(index, value)}
                        setRowRelevance={relevance =>
                          setRowRelevance(index, relevance)
                        }
                        onRemoveClick={() => onRemoveClick({ index })}
                      />
                    )
                )}
          </tbody>
          <MyTableFooter
            sortable={sortable}
            loadable={loadable}
            onAddClick={onAddClick}
            onRefreshClick={onRefreshClick}
          />
        </Table>
      )}
    />
  )
);

const moveItemAtIndex = (arr, oldIndex, newIndex) => {
  const tmpArr = [...arr];
  const ref = tmpArr[oldIndex];
  tmpArr.splice(oldIndex, 1);
  tmpArr.splice(newIndex, 0, ref);
  return tmpArr.map((ref, index) => ({
    ...ref,
    position: index
  }));
};

const CDTNReferences = ({
  sortable = false,
  loadable = true,
  values,
  setFieldValue,
  setFieldTouched
}) => (
  <References
    sortable={sortable}
    loadable={loadable}
    useDragHandle={true}
    onSortEnd={({ oldIndex, newIndex }) => {
      const newRefs = moveItemAtIndex(values.refs, oldIndex, newIndex);
      setFieldValue("refs", newRefs);
      setFieldTouched("refs");
    }}
    values={values.refs || []}
    setRowValue={(i, value) => {
      const rowId = getRowId(value._source); //return source/slug or url
      values.refs[i].url = rowId;
      values.refs[i].title = value._source.title;
      setFieldValue("refs", values.refs);
      setFieldTouched("refs");
    }}
    setRowRelevance={(i, value) => {
      values.refs[i].relevance = value;
      setFieldValue("refs", values.refs);
      setFieldTouched("refs");
    }}
    onAddClick={() => {
      setFieldTouched("refs");
      setFieldValue(
        "refs",
        (values.refs || []).concat([{ title: "", url: "" }])
      );
    }}
    onRemoveClick={({ index }) => {
      values.refs.splice(index, 1);
      setFieldValue("refs", values.refs);
      setFieldTouched("refs");
    }}
    onRefreshClick={async () => {
      const res = await searchResults(values.title);
      // concat with current selection, removing duplicates
      const hits =
        (res.hits.hits &&
          res.hits.hits
            .filter(hit =>
              values.refs
                ? values.refs
                    .map(ref => ref.url)
                    .indexOf(getRowId(hit._source)) === -1
                : true
            )
            .map(hit => ({
              title: hit._source.title,
              url: getRowId(hit._source)
            }))) ||
        [];
      setFieldValue("refs", (values.refs || []).concat(hits));
      setFieldTouched("refs");
    }}
  />
);

export default CDTNReferences;
