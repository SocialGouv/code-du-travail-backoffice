# datafiller

Custom React forms to edit random data collections.

Use [Kinto](https://kinto.readthedocs.io) as a backend.

## Scripts

- download-dump : download latest CDTN documents index
- detect-doublons : return list of detected doublons
- fix-urls : autofix detected urls and mark others as invalid

## Get the data back

Get a dump of the bucket `datasets` and collection `requetes` :

```sh
curl https://xxxxxx/kinto/v1/buckets/datasets/collections/requetes/records > bckp-(date +%y-%m-%d-%H-%M).json
```
